import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreditStatusCommand } from '../../application/creditStatus/commands/creditStatus.command';
import { CreditStatusDto } from '../dtos/creditStatus.dto';
import { Credit } from '@prisma/client';

@Controller('credit/status')
export class CreditStatusController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(':userId')
  async create(@Param('userId') userId: string): Promise<Credit> {
    const dto = new CreditStatusDto();
    dto.userId = userId;

    const command = new CreditStatusCommand(dto.userId);
    return await this.commandBus.execute(command);
  }
}
