import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Certifique-se de ter este serviço
import { CreditStatusRepository } from '../../domain/creditStatus/repositories/creditStatus.repository';

@Injectable()
export class PostgresCreditStatusRepository implements CreditStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<any> {
    console.log(`🔍 Buscando CreditRequest do UserID: ${userId}`);
    return await this.prisma.credit.findFirst({
      where: { userId },
    });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    console.log(
      `🔄 Atualizando status do CreditRequest com ID: ${id} para: ${status}`,
    );

    await this.prisma.credit.update({
      where: { id },
      data: { status },
    });
  }
}
