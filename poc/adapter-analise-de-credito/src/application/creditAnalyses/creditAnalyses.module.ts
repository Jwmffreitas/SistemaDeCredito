import { Module } from '@nestjs/common';
import { RabbitMQConnector } from 'src/infrastructure/rabbitmq/rabbitmqConnector';
import { CreditRequestAdapterService } from './services/creditAnalyses.service';

@Module({
  providers: [CreditRequestAdapterService, RabbitMQConnector],
})
export class CreditAnalysesModule {}
