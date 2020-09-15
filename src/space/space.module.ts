import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceSchema } from './space.entity';
import { SpaceController } from './space.controller';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: 'Space',
      schema: SpaceSchema
    }
  ])],
  providers: [SpaceService],
  controllers: [SpaceController]
})
export class SpaceModule {}
