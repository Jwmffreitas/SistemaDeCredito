import { Injectable } from '@nestjs/common';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { PostgresCreditStatusRepository } from 'src/infrastructure/postgres/creditStatusRepository';
import { Credit } from 'src/domain/entities/credit.entity';

@Injectable()
export class CreditStatusService {
  constructor(
    private readonly creditStatusRepository: PostgresCreditStatusRepository,
  ) {}

  async getStatus(command: CreditStatusCommand): Promise<Credit | null> {
    return await this.creditStatusRepository.findByUserId(command.userId);
  }
}
