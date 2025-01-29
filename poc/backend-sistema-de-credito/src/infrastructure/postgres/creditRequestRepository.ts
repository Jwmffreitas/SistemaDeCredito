import { CreditRequestRepository } from '../../domain/creditRequest/repositories/creditRequest.repository';
import { Credit } from '../../domain/entities/credit.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresCreditRequestRepository
  implements CreditRequestRepository
{
  create(creditRequest: Credit): any {
    console.log('Criando CreditRequest no banco de dados:', creditRequest);
  }
}
