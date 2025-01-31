import { Module } from '@nestjs/common';
import { CreditRequestController } from '../../presentation/controllers/creditRequest.controller';
import { CreditRequestService } from './services/creditRequest.service';
import { CreateCreditRequestHandler } from './handlers/createCreditRequest.handler';
import { PostgresCreditRequestRepository } from '../../infrastructure/postgres/creditRequestRepository';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  imports: [CqrsModule],
  controllers: [CreditRequestController],
  providers: [
    CreditRequestService,
    PostgresCreditRequestRepository,
    PrismaService,
    CreateCreditRequestHandler,
    RabbitMQConnector,
  ],
})
export class CreditRequestModule {}
