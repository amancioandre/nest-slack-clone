import { Module } from '@nestjs/common';
import { SlackGateway } from './slack/slack.gateway';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SpaceModule } from './space/space.module';
import { RoomModule } from './room/room.module';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest-slack-clone'), UserModule, AuthModule, SpaceModule, RoomModule],
  controllers: [],
  providers: [SlackGateway],
})
export class AppModule {}
