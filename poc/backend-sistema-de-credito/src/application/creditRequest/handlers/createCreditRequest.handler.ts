import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCreditRequestCommand } from '../commands/createCreditRequest.command';
import { CreditRequestService } from '../services/creditRequest.service';

@CommandHandler(CreateCreditRequestCommand)
export class CreateCreditRequestHandler
  implements ICommandHandler<CreateCreditRequestCommand>
{
  constructor(private readonly creditRequestService: CreditRequestService) {}

  async execute(command: CreateCreditRequestCommand): Promise<void> {
    await this.creditRequestService.createRequest(command);
  }
}
