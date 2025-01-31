import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('🟢 Conectado ao banco de dados');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔴 Desconectado do banco de dados');
  }
}
