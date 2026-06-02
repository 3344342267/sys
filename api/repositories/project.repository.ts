import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '../../shared/types';

export class ProjectRepository {
  create(userId: string, data: { title: string; description?: string; cover?: string; tags?: string[] }): Project {
    const id = uuidv4();
    const tags = JSON.stringify(data.tags || []);
    const wordCount = 0;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO projects (id, user_id, title, description, cover, tags, word_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, data.title, data.description || null, data.cover || null, tags, wordCount, now, now);

    return {
      id,
      userId,
      title: data.title,
      description: data.description,
      cover: data.cover,
      tags: data.tags || [],
      wordCount,
      createdAt: now,
      updatedAt: now
    };
  }

  findByUserId(userId: string): Project[] {
    const rows = db.prepare(`
      SELECT id, user_id, title, description, cover, tags, word_count, created_at, updated_at
      FROM projects WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(userId) as any[];

    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      cover: row.cover,
      tags: JSON.parse(row.tags || '[]'),
      wordCount: row.word_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  findById(id: string, userId: string): Project | null {
    const row = db.prepare(`
      SELECT id, user_id, title, description, cover, tags, word_count, created_at, updated_at
      FROM projects WHERE id = ? AND user_id = ?
    `).get(id, userId) as any;

    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      cover: row.cover,
      tags: JSON.parse(row.tags || '[]'),
      wordCount: row.word_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  update(id: string, userId: string, data: Partial<{ title: string; description: string; cover: string; tags: string[] }>): Project | null {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.cover !== undefined) {
      updates.push('cover = ?');
      values.push(data.cover);
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(data.tags));
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id, userId);

    db.prepare(`
      UPDATE projects SET ${updates.join(', ')} WHERE id = ? AND user_id = ?
    `).run(...values);

    return this.findById(id, userId);
  }

  updateWordCount(id: string, wordCount: number): void {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE projects SET word_count = ?, updated_at = ? WHERE id = ?
    `).run(wordCount, now, id);
  }

  delete(id: string, userId: string): boolean {
    const result = db.prepare(`
      DELETE FROM projects WHERE id = ? AND user_id = ?
    `).run(id, userId);

    return result.changes > 0;
  }
}

export const projectRepository = new ProjectRepository();
