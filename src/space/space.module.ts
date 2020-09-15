import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceSchema } from './space.entity';
import { SpaceController } from './space.controller';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/user.entity';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: 'Space',
      schema: SpaceSchema
    },
    {
      name: 'User',
      schema: UserSchema
    }
  ]),
  UserModule
],
  providers: [SpaceService],
  controllers: [SpaceController]
})
export class SpaceModule {}
