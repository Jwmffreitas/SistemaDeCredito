import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfirmChannel, Connection, connect } from 'amqplib';

@Injectable()
export class RabbitMQConnector implements OnModuleInit, OnModuleDestroy {
  private connection: Connection | null;
  private channel: ConfirmChannel | null;
  private readonly url = process.env.RABBITMQ_URL || 'amqp://localhost';

  async onModuleInit(): Promise<void> {
    await this.connect();
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
        setTimeout(() => this.connect(), 5000);
      });
    } catch (error) {
      Logger.error('❌ Falha ao conectar no RabbitMQ:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publish(
    queue: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    try {
      if (!this.channel) {
        Logger.warn(
          '⚠️ Canal do RabbitMQ não está pronto, tentando reconectar...',
        );
        await this.connect();
      }
      if (!this.channel) {
        Logger.error(
          '❌ Falha ao publicar mensagem: canal ainda indisponível.',
        );
        return;
      }

      const exchange = 'creditRequest';
      const exchangeType = 'fanout';
      await this.channel.assertExchange(exchange, exchangeType, {
        durable: true,
      });

      const msgBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish(exchange, '', msgBuffer);

      Logger.log(`📩 Mensagem enviada para a exchange [${exchange}]`, message);
    } catch (error) {
      Logger.error('❌ Erro ao publicar mensagem:', error);
    }
  }

  async consume(
    queue: string,
    callback: (msg: Record<string, unknown>) => void,
  ): Promise<void> {
    try {
      if (!this.channel) {
        Logger.warn(
          '⚠️ Canal do RabbitMQ não está pronto, tentando reconectar...',
        );
        await this.connect();
      }
      if (!this.channel) {
        Logger.error('❌ Falha ao iniciar consumo: canal ainda indisponível.');
        return;
      }

      await this.channel.assertQueue(queue, { durable: true });

      this.channel.consume(queue, (msg) => {
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

      Logger.log(`👂 Consumindo mensagens da fila [${queue}]`);
    } catch (error) {
      Logger.error('❌ Erro ao configurar consumo:', error);
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
