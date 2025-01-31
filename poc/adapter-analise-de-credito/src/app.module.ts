import { Module } from '@nestjs/common';
import { CreditAnalysesModule } from './application/creditAnalyses/creditAnalyses.module';

@Module({
  imports: [CreditAnalysesModule],
})
export class AppModule {}
