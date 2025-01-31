import { Module } from '@nestjs/common';
import { CreditRequestModule } from './application/creditRequest/creditRequest.module';
import { CreditStatusModule } from './application/creditStatus/creditStatus.module';

@Module({
  imports: [CreditRequestModule, CreditStatusModule],
})
export class AppModule {}
