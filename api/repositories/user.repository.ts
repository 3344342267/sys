import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../../shared/types';
import bcrypt from 'bcrypt';

export class UserRepository {
  async create(email: string, password: string, nickname: string): Promise<User> {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, nickname, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, passwordHash, nickname, createdAt);

    return {
      id,
      email,
      nickname,
      createdAt
    };
  }

  async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const row = db.prepare(`
      SELECT id, email, password_hash, nickname, created_at
      FROM users WHERE email = ?
    `).get(email) as any;

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      nickname: row.nickname,
      createdAt: row.created_at
    };
  }

  async findById(id: string): Promise<User | null> {
    const row = db.prepare(`
      SELECT id, email, nickname, created_at
      FROM users WHERE id = ?
    `).get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      createdAt: row.created_at
    };
  }

  async validatePassword(user: User & { passwordHash: string }, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }
}

export const userRepository = new UserRepository();
