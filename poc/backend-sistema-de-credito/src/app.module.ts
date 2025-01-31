import { Module } from '@nestjs/common';
import { CreditRequestModule } from './application/creditRequest/creditRequest.module';
import { CreditStatusModule } from './application/creditStatus/creditStatus.module';
import { RabbitMQConnector } from './infrastructure/rabbitmq/rabbitmqConnector';

@Module({
  imports: [CreditRequestModule, CreditStatusModule],
  providers: [RabbitMQConnector],
})
export class AppModule {}
