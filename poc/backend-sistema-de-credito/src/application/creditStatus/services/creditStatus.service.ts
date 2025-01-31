import { Injectable } from '@nestjs/common';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { PostgresCreditStatusRepository } from 'src/infrastructure/postgres/creditStatusRepository';
import { Credit } from '@prisma/client';

@Injectable()
export class CreditStatusService {
  constructor(
    private readonly creditStatusRepository: PostgresCreditStatusRepository,
  ) {}

  async getStatus(command: CreditStatusCommand): Promise<Credit> {
    return await this.creditStatusRepository.findByUserId(command.userId);
  }
}
