import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.entity';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
    JwtModule.register({
      secret: 'secret_key',
      signOptions: { expiresIn: `${60 * 60}s` }, // 1 hour
    })
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
