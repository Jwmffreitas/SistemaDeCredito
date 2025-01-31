import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfirmChannel, Connection, connect } from 'amqplib';

@Injectable()
export class RabbitMQConnector implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | null = null;
  private channel: ConfirmChannel | null = null;
  private readonly url = process.env.RABBITMQ_URL || 'amqp://localhost';

  async onModuleInit(): Promise<void> {
    await this.retryConnect();
  }

  private async retryConnect(): Promise<void> {
    while (true) {
      try {
        this.connection = await connect(this.url);
        this.channel = await this.connection.createConfirmChannel();
        Logger.log('✅ Conectado ao RabbitMQ');
        break;
      } catch (error) {
        Logger.error('❌ Erro ao conectar no RabbitMQ:', error);
        Logger.warn('⚠️ Tentando reconectar em 5 segundos...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    this.connection?.on('error', (err) => {
      Logger.error('❌ Erro na conexão com RabbitMQ:', err);
    });

    this.connection?.on('close', async () => {
      Logger.warn('⚠️ Conexão com RabbitMQ fechada, tentando reconectar...');
      this.channel = null;
      this.connection = null;
      await this.retryConnect();
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.channel) {
      Logger.warn(
        '⚠️ Canal do RabbitMQ não está pronto. Tentando reconectar...',
      );
      await this.retryConnect();
    }
  }

  async publish(message: Record<string, unknown>): Promise<void> {
    while (true) {
      try {
        await this.ensureConnection();

        if (!this.channel) {
          Logger.error('❌ Canal ainda indisponível após reconectar.');
          continue;
        }

        const exchange = 'creditAnalyses';
        const exchangeType = 'fanout';
        await this.channel.assertExchange(exchange, exchangeType, {
          durable: true,
        });

        const msgBuffer = Buffer.from(JSON.stringify(message));
        await this.channel.publish(exchange, '', msgBuffer);

        Logger.log(
          `📩 Mensagem enviada para a exchange [${exchange}]`,
          message,
        );
        break;
      } catch (error) {
        Logger.error('❌ Erro ao publicar mensagem:', error);
        Logger.warn('⚠️ Tentando novamente em 5 segundos...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async consume(
    exchange: string,
    routingKey: string,
    queue: string,
    callback: (msg: Record<string, unknown>) => void,
  ): Promise<void> {
    while (true) {
      try {
        await this.ensureConnection();

        if (!this.channel) {
          Logger.error('❌ Canal ainda indisponível após reconectar.');
          continue;
        }

        await this.channel.assertExchange(exchange, 'fanout', {
          durable: true,
        });

        const q = await this.channel.assertQueue(queue, { exclusive: true });
        await this.channel.bindQueue(q.queue, exchange, routingKey);

        await this.channel.consume(q.queue, (msg) => {
          if (!msg) return;

          try {
            const content: unknown = JSON.parse(msg.content.toString());
            if (typeof content === 'object' && content !== null) {
              callback(content as Record<string, unknown>);
            } else {
              Logger.warn(
                '⚠️ Mensagem recebida em formato inesperado:',
                content,
              );
            }
          } catch (error) {
            Logger.error('❌ Erro ao processar mensagem:', error);
          }

          this.channel?.ack(msg);
        });

        Logger.log(
          `👂 Consumindo mensagens da exchange [${exchange}] na fila [${queue}]`,
        );
        break;
      } catch (error) {
        Logger.error('❌ Erro ao configurar consumo:', error);
        Logger.warn('⚠️ Tentando novamente em 5 segundos...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.closeConnection();
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
        Logger.log('🔌 Conexão com RabbitMQ fechada.');
      }
    } catch (error) {
      Logger.error('❌ Erro ao fechar conexão RabbitMQ:', error);
    }
  }
}
