import { CreditRequest } from '../entities/creditRequest.entity';

export interface CreditRequestRepository {
  create(creditRequest: CreditRequest): Promise<void>;
  findById(id: string): Promise<CreditRequest | null>;
  updateStatus(id: string, status: string): Promise<void>;
}
