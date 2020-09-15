import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.entity';

@Module({imports: [
    MongooseModule.forFeature([
        {
            name: 'User',
            schema: UserSchema
        }
    ])
], providers: []})
export class UserModule {}
