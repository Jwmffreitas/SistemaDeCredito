import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { CreditStatusService } from '../services/creditStatus.service';
import { Credit } from '@prisma/client';

@CommandHandler(CreditStatusCommand)
export class CreateCreditRequestHandler
  implements ICommandHandler<CreditStatusCommand>
{
  constructor(private readonly creditStatusService: CreditStatusService) {}

  async execute(command: CreditStatusCommand): Promise<Credit> {
    return await this.creditStatusService.getStatus(command);
  }
}
