import { CreditRequestRepository } from '../../domain/creditRequest/repositories/creditRequest.repository';
import { CreditRequest } from '../../domain/creditRequest/entities/creditRequest.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresCreditRequestRepository
  implements CreditRequestRepository
{
  create(creditRequest: CreditRequest): any {
    console.log('Criando CreditRequest no banco de dados:', creditRequest);
  }

  findById(id: string): any {
    console.log(`Buscando CreditRequest com ID: ${id}`);
    return null;
  }

  updateStatus(id: string, status: string): any {
    console.log(
      `Atualizando status de CreditRequest com ID: ${id} para: ${status}`,
    );
  }
}
