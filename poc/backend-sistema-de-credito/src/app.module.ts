import { Module } from '@nestjs/common';
import { CreditRequestModule } from './application/creditRequest/creditRequest.module';

@Module({
  imports: [CreditRequestModule],
})
export class AppModule {}
