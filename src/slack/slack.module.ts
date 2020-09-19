import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SpaceModule } from 'src/space/space.module';
import { User, UserSchema } from 'src/user/user.entity';
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
        SpaceModule
    ],
    providers: [SlackGateway]
})
export class SlackModule {}
