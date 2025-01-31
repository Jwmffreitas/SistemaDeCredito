import { Module } from '@nestjs/common';
import { CreditStatusService } from './services/creditStatus.service';
import { CreateCreditRequestHandler } from './handlers/creditStatus.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreditStatusController } from 'src/presentation/controllers/creditStatus.controller';
import { PostgresCreditStatusRepository } from 'src/infrastructure/postgres/creditStatusRepository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  imports: [CqrsModule],
  controllers: [CreditStatusController],
  providers: [
    CreditStatusService,
    PostgresCreditStatusRepository,
    CreateCreditRequestHandler,
    PrismaService,
  ],
})
export class CreditStatusModule {}
