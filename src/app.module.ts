import { Module } from '@nestjs/common';
import { SlackGateway } from './slack/slack.gateway';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest-slack-clone'), UserModule],
  controllers: [],
  providers: [SlackGateway],
})
export class AppModule {}
