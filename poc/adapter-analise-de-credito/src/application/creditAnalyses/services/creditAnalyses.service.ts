import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector'; // O conector RabbitMQ

@Injectable()
export class CreditRequestAdapterService {
  private readonly logger = new Logger(CreditRequestAdapterService.name);

  constructor(private readonly rabbitMQ: RabbitMQConnector) {}

  async onModuleInit() {
    await this.consumeAndProcess();
  }

  async consumeAndProcess(): Promise<void> {
    await this.rabbitMQ.consume(
      'creditRequest',
      'adapter.creditAnalyses',
      '',
      (message: any) => {
        this.logger.log(`📥 Mensagem recebida: ${JSON.stringify(message)}`);

        const status = this.getRandomStatus();

        const updatedMessage = { ...message, status };

        setTimeout(async () => {
          this.logger.log(
            `Análise concluída! Atualizando creditRequest ${message.id} status para: ${status}`,
          );

          await this.rabbitMQ.publish(updatedMessage);
        }, 10000);
      },
    );
  }

  private getRandomStatus(): string {
    const statuses = ['APROVADO', 'NEGADO'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}
