import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCreditRequestCommand } from '../commands/createCreditRequest.command';
import { CreditRequestService } from '../services/creditRequest.service';
import { Credit } from 'src/domain/entities/credit.entity';

@CommandHandler(CreateCreditRequestCommand)
export class CreateCreditRequestHandler
  implements ICommandHandler<CreateCreditRequestCommand>
{
  constructor(private readonly creditRequestService: CreditRequestService) {}

  async execute(command: CreateCreditRequestCommand): Promise<Credit> {
    return await this.creditRequestService.createRequest(command);
  }
}
