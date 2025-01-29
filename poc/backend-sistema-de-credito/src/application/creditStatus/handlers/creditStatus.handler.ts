import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreditStatusCommand } from '../commands/creditStatus.command';
import { CreditStatusService } from '../services/creditStatus.service';

@CommandHandler(CreditStatusCommand)
export class CreateCreditRequestHandler
  implements ICommandHandler<CreditStatusCommand>
{
  constructor(private readonly creditStatusService: CreditStatusService) {}

  async execute(command: CreditStatusCommand): Promise<void> {
    await this.creditStatusService.getStatus(command);
  }
}
