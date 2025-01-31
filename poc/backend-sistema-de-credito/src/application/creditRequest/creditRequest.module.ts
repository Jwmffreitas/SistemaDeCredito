import { Module } from '@nestjs/common';
import { CreditRequestController } from '../../presentation/controllers/creditRequest.controller';
import { CreditRequestService } from './services/creditRequest.service';
import { CreateCreditRequestHandler } from './handlers/createCreditRequest.handler';
import { PostgresCreditRequestRepository } from '../../infrastructure/postgres/creditRequestRepository';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector';

@Module({
  imports: [CqrsModule],
  controllers: [CreditRequestController],
  providers: [
    CreditRequestService,
    PostgresCreditRequestRepository,
    CreateCreditRequestHandler,
    RabbitMQConnector,
  ],
})
export class CreditRequestModule {}
