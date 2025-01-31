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
    await this.connect().catch((error) =>
      Logger.error('Erro ao conectar:', error),
    );
  }

  private async ensureConnection(): Promise<void> {
    if (!this.channel) {
      Logger.warn(
        '⚠️ Canal do RabbitMQ não está pronto. Tentando reconectar...',
      );
      await this.connect().catch((error) =>
        Logger.error('Erro ao conectar:', error),
      );
    }
  }

  async connect(): Promise<void> {
    try {
      this.connection = await connect(this.url);
      this.channel = await this.connection.createConfirmChannel();
      Logger.log('✅ Conectado ao RabbitMQ');

      this.connection.on('error', (err) => {
        Logger.error('❌ Erro na conexão com RabbitMQ:', err);
      });

      this.connection.on('close', () => {
        Logger.warn('⚠️ Conexão com RabbitMQ fechada, tentando reconectar...');
        this.channel = null;
        this.connection = null;
        setTimeout(
          () =>
            this.connect().catch((error) =>
              Logger.error('Erro ao reconectar:', error),
            ),
          5000,
        );
      });
    } catch (error) {
      Logger.error('❌ Falha ao conectar no RabbitMQ:', error);
      setTimeout(
        () =>
          this.connect().catch((error) =>
            Logger.error('Erro ao reconectar:', error),
          ),
        5000,
      );
    }
  }

  async publish(message: Record<string, unknown>): Promise<void> {
    try {
      await this.ensureConnection();

      if (!this.channel) {
        Logger.error(
          '❌ Falha ao publicar mensagem: canal ainda indisponível.',
        );
        return;
      }

      const exchange = 'creditAnalyses';
      const exchangeType = 'fanout';
      await this.channel.assertExchange(exchange, exchangeType, {
        durable: true,
      });

      const msgBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish(exchange, '', msgBuffer);

      Logger.log(`📩 Mensagem enviada para a exchange [${exchange}]`, message);
    } catch (error) {
      Logger.error('❌ Erro ao publicar mensagem:', error);
      setTimeout(
        () =>
          this.publish(message).catch((error) =>
            Logger.error('Erro ao publicar após falha:', error),
          ),
        5000,
      );
    }
  }

  async consume(
    exchange: string,
    routingKey: string,
    queue: string,
    callback: (msg: Record<string, unknown>) => void,
  ): Promise<void> {
    try {
      await this.ensureConnection();

      if (!this.channel) {
        Logger.error(
          '❌ Falha ao consumir mensagem: canal ainda indisponível.',
        );
        return;
      }

      await this.channel.assertExchange(exchange, 'fanout', {
        durable: true,
      });

      const q = await this.channel.assertQueue(queue, { exclusive: true });
      await this.channel.bindQueue(q.queue, exchange, routingKey);

      this.channel.consume(q.queue, (msg) => {
        if (!msg) return;

        try {
          const content: unknown = JSON.parse(msg.content.toString());
          if (typeof content === 'object' && content !== null) {
            callback(content as Record<string, unknown>);
          } else {
            Logger.warn('⚠️ Mensagem recebida em formato inesperado:', content);
          }
        } catch (error) {
          Logger.error('❌ Erro ao processar mensagem:', error);
        }

        this.channel?.ack(msg);
      });

      Logger.log(
        `👂 Consumindo mensagens da exchange [${exchange}] na fila [${queue}]`,
      );
    } catch (error) {
      Logger.error('❌ Erro ao configurar consumo:', error);
      setTimeout(() => {
        this.consume(exchange, routingKey, queue, callback).catch((error) =>
          Logger.error('Erro ao consumir após falha:', error),
        );
      }, 5000);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.closeConnection().catch((error) =>
      Logger.error('Erro ao fechar a conexão:', error),
    );
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
