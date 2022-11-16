import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authenticate } from 'passport';
import { RolesGuard } from './framework/roles.guard';
import { JwtStrategy } from './services/passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { USE_CASES } from './usecases';
import { AnalyticsService } from '@nest-starter/core';
import { SharedModule } from '../shared/shared.module';
import { GithubStrategy } from './services/passport/github.strategy';
import { GqlAuthGuard } from './framework/gql-auth.guard';

const AUTH_STRATEGIES = [];

if (process.env.GITHUB_OAUTH_CLIENT_ID) {
  AUTH_STRATEGIES.push(GithubStrategy);
}

@Module({
  imports: [
    SharedModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secretOrKeyProvider: () => process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: 360000,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [...USE_CASES, ...AUTH_STRATEGIES, JwtStrategy, AnalyticsService, AuthService, RolesGuard, GqlAuthGuard],
  exports: [RolesGuard, AuthService, GqlAuthGuard],
})
export class AuthModule  {}
