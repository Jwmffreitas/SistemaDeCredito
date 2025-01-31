import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCreditRequestCommand } from '../../application/creditRequest/commands/createCreditRequest.command';
import { CreateCreditRequestDto } from '../dtos/createCreditRequest.dto';
import { Credit } from '@prisma/client';

@Controller('credit/apply')
export class CreditRequestController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateCreditRequestDto): Promise<Credit> {
    const command = new CreateCreditRequestCommand(dto.userId, dto.amount);
    return await this.commandBus.execute(command);
  }
}
