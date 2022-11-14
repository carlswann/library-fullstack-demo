import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@nest-starter/core';
import { LoginCommand } from './login.command';
import { ApiException } from '../../../shared/exceptions/api.exception';

import { normalizeEmail } from '../../../shared/helpers/email-normalization.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class Login {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

  async execute(command: LoginCommand) {
    const email = normalizeEmail(command.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new ApiException('User not found');
    if (!user.password) throw new ApiException('OAuth user login attempt');

    const isMatching = await bcrypt.compare(command.password, user.password);
    if (!isMatching) throw new ApiException('Wrong credentials provided');

    return await this.authService.getSignedToken(user);
  }
}
