import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from '@nest-starter/core';
import { CreateUserCommand } from './create-user.dto';

@Injectable()
export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserCommand): Promise<UserEntity> {
    const user = new UserEntity();

    user.email = data.email ? data.email.toLowerCase() : null;
    user.firstName = data.firstName ? data.firstName.toLowerCase() : null;
    user.lastName = data.lastName ? data.lastName.toLowerCase() : data.lastName;
    user.profilePicture = data.picture;
    user.tokens = [
      {
        providerId: data.auth.profileId,
        provider: data.auth.provider,
        accessToken: data.auth.accessToken,
        refreshToken: data.auth.refreshToken,
        valid: true,
        lastUsed: null,
      },
    ];

    return await this.userRepository.create(user);
  }
}
