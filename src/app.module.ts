import { Module } from '@nestjs/common';
import { SlackGateway } from './slack/slack.gateway';
import { MongooseModule } from "@nestjs/mongoose";
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest-slack-clone')],
  controllers: [],
  providers: [SlackGateway],
})
export class AppModule {}
