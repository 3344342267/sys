import { userRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';
import type { User } from '../../shared/types';

export class AuthService {
  async register(email: string, password: string, nickname: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await userRepository.create(email, password, nickname);
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string) {
    const userWithHash = await userRepository.findByEmail(email);
    if (!userWithHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await userRepository.validatePassword(userWithHash, password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const user: User = {
      id: userWithHash.id,
      email: userWithHash.email,
      nickname: userWithHash.nickname,
      createdAt: userWithHash.createdAt
    };

    const token = this.generateToken(user);

    return { user, token };
  }

  async getUserById(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

export const authService = new AuthService();
