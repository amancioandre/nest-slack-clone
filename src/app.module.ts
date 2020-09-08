import { Module } from '@nestjs/common';
import { SlackGateway } from './slack/slack.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SlackGateway],
})
export class AppModule {}
