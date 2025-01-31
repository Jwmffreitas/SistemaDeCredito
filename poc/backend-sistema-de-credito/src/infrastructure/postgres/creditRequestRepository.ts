import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditRequestRepository } from '../../domain/creditRequest/repositories/creditRequest.repository';
import { Credit } from '../../domain/entities/credit.entity';

@Injectable()
export class PostgresCreditRequestRepository
  implements CreditRequestRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(creditRequest: Credit): Promise<void> {
    Logger.log('Criando CreditRequest no banco de dados:', creditRequest);

    await this.prisma.credit.create({
      data: {
        id: creditRequest.id,
        userId: creditRequest.userId,
        amount: creditRequest.amount,
        status: creditRequest.status,
        createdAt: creditRequest.createdAt,
      },
    });
  }
}
