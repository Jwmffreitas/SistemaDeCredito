import { CreditStatusRepository } from '../../domain/creditStatus/repositories/creditStatus.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresCreditStatusRepository implements CreditStatusRepository {
  findByUserId(userId: string): any {
    console.log(`Buscando CreditRequest com do UserID: ${userId}`);
    return null;
  }

  updateStatus(id: string, status: string): any {
    console.log(
      `Atualizando status de CreditRequest com ID: ${id} para: ${status}`,
    );
  }
}
