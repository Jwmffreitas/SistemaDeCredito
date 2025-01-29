import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCreditRequestCommand } from '../../application/creditRequest/commands/createCreditRequest.command';
import { CreateCreditRequestDto } from '../dtos/createCreditRequest.dto';

@Controller('credit/apply')
export class CreditRequestController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateCreditRequestDto): Promise<void> {
    const command = new CreateCreditRequestCommand(dto.userId, dto.amount);
    await this.commandBus.execute(command);
  }
}
