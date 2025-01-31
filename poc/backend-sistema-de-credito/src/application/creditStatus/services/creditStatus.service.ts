import { Injectable, Logger } from '@nestjs/common';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { PostgresCreditStatusRepository } from 'src/infrastructure/postgres/creditStatusRepository';
import { Credit } from '@prisma/client';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector';

@Injectable()
export class CreditStatusService {
  constructor(
    private readonly creditStatusRepository: PostgresCreditStatusRepository,
    private readonly rabbitMQ: RabbitMQConnector,
  ) {}

  async onModuleInit() {
    await this.consumeAndUpdate();
  }

  async getStatus(command: CreditStatusCommand): Promise<Credit> {
    return await this.creditStatusRepository.findByUserId(command.userId);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.creditStatusRepository.updateStatus(id, status);
  }

  async consumeAndUpdate(): Promise<void> {
    await this.rabbitMQ.consume(
      'creditAnalyses',
      'backend.updateCreditStatus',
      '',
      async (message: any) => {
        Logger.log(`📥 Mensagem recebida: ${JSON.stringify(message)}`);

        await this.updateStatus(message.id, message.status);

        Logger.log(
          `creditRequest ${message.id} atualizado para: ${message.status}`,
        );
      },
    );
  }
}
