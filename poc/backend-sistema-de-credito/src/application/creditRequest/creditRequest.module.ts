import { Module } from '@nestjs/common';
import { CreditRequestController } from '../../presentation/controllers/creditRequest.controller';
import { CreditRequestService } from './services/creditRequest.service';
import { CreateCreditRequestHandler } from './handlers/createCreditRequest.handler';
import { PostgresCreditRequestRepository } from '../../infrastructure/postgres/creditRequestRepository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [CreditRequestController],
  providers: [
    CreditRequestService,
    PostgresCreditRequestRepository,
    CreateCreditRequestHandler,
  ],
})
export class CreditRequestModule {}
