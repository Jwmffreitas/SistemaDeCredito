import { Credit } from '../../entities/credit.entity';

export interface CreditStatusRepository {
  findByUserId(userId: string): Promise<Credit | null>;
  updateStatus(id: string, status: string): Promise<void>;
}
