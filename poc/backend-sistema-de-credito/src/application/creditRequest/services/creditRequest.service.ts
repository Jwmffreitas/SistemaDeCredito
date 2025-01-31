import { Injectable } from '@nestjs/common';
import { CreateCreditRequestCommand } from '../commands/createCreditRequest.command';
import { Credit } from '../../../domain/entities/credit.entity';
import { v4 as uuidv4 } from 'uuid';
import { PostgresCreditRequestRepository } from 'src/infrastructure/postgres/creditRequestRepository';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector';

@Injectable()
export class CreditRequestService {
  constructor(
    private readonly creditRequestRepository: PostgresCreditRequestRepository,
    private readonly rabbitMQ: RabbitMQConnector,
  ) {}

  async createRequest(command: CreateCreditRequestCommand): Promise<void> {
    const creditRequest = new Credit(
      uuidv4(),
      command.userId,
      command.amount,
      'PENDING',
      new Date(),
    );

    await this.creditRequestRepository.create(creditRequest);

    await this.sendRequest(creditRequest);
  }

  async sendRequest(creditRequest: Credit) {
    const payload = { ...creditRequest };
    await this.rabbitMQ.publish('credit_analysis_queue', payload);
  }
}
