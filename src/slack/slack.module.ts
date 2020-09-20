import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomModule } from 'src/room/room.module';
import { User, UserSchema } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { SlackGateway } from './slack.gateway';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            }
        ]),
        AuthModule,
        UserModule,
        RoomModule
    ],
    providers: [SlackGateway]
})
export class SlackModule {}
