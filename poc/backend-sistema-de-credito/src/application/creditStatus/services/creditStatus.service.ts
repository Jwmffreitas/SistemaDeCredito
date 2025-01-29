import { Injectable } from '@nestjs/common';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { PostgresCreditStatusRepository } from 'src/infrastructure/postgres/creditStatusRepository';

@Injectable()
export class CreditStatusService {
  constructor(
    private readonly creditStatusRepository: PostgresCreditStatusRepository,
  ) {}

  async getStatus(command: CreditStatusCommand): Promise<void> {
    await this.creditStatusRepository.findByUserId(command.userId);
  }
}
