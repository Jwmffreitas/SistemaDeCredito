import { Injectable } from '@nestjs/common';
import { CreateCreditRequestCommand } from '../commands/createCreditRequest.command';
import { CreditRequest } from '../../../domain/creditRequest/entities/creditRequest.entity';
import { v4 as uuidv4 } from 'uuid';
import { PostgresCreditRequestRepository } from 'src/infrastructure/postgres/creditRequestRepository';

@Injectable()
export class CreditRequestService {
  constructor(
    private readonly creditRequestRepository: PostgresCreditRequestRepository,
  ) {}

  async createRequest(command: CreateCreditRequestCommand): Promise<void> {
    const creditRequest = new CreditRequest(
      uuidv4(),
      command.userId,
      command.amount,
      'PENDING',
      new Date(),
    );

    await this.creditRequestRepository.create(creditRequest);
  }
}
