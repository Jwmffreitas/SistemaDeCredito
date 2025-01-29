import { Credit } from '../../entities/credit.entity';

export interface CreditRequestRepository {
  create(creditRequest: Credit): Promise<void>;
}
