import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './user.entity';

@Module({imports: [
    MongooseModule.forFeature([
        {
            name: User.name,
            schema: UserSchema
        }
    ])
], providers: []})
export class UserModule {}
