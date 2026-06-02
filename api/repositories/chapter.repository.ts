import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';
import type { Chapter } from '../../shared/types';

export class ChapterRepository {
  create(projectId: string, data: { title: string; content?: string; summary?: string; status?: string }): Chapter {
    const id = uuidv4();
    const now = new Date().toISOString();
    const maxOrder = db.prepare(`
      SELECT MAX(chapter_order) as max_order FROM chapters WHERE project_id = ?
    `).get(projectId) as any;

    const order = (maxOrder?.max_order || 0) + 1;
    const wordCount = this.calculateWordCount(data.content || '');

    db.prepare(`
      INSERT INTO chapters (id, project_id, title, content, summary, status, chapter_order, word_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, projectId, data.title, data.content || '', data.summary || null, data.status || 'draft', order, wordCount, now, now);

    return {
      id,
      projectId,
      title: data.title,
      content: data.content || '',
      summary: data.summary,
      status: (data.status || 'draft') as 'draft' | 'review' | 'published',
      order,
      wordCount,
      createdAt: now,
      updatedAt: now
    };
  }

  findByProjectId(projectId: string): Chapter[] {
    const rows = db.prepare(`
      SELECT id, project_id, title, content, summary, status, chapter_order, word_count, created_at, updated_at
      FROM chapters WHERE project_id = ?
      ORDER BY chapter_order ASC
    `).all(projectId) as any[];

    return rows.map(row => ({
      id: row.id,
      projectId: row.project_id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      status: row.status as 'draft' | 'review' | 'published',
      order: row.chapter_order,
      wordCount: row.word_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  findById(id: string, projectId: string): Chapter | null {
    const row = db.prepare(`
      SELECT id, project_id, title, content, summary, status, chapter_order, word_count, created_at, updated_at
      FROM chapters WHERE id = ? AND project_id = ?
    `).get(id, projectId) as any;

    if (!row) return null;

    return {
      id: row.id,
      projectId: row.project_id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      status: row.status as 'draft' | 'review' | 'published',
      order: row.chapter_order,
      wordCount: row.word_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  update(id: string, projectId: string, data: Partial<{ title: string; content: string; summary: string; status: string }>): Chapter | null {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.content !== undefined) {
      updates.push('content = ?');
      values.push(data.content);
      updates.push('word_count = ?');
      values.push(this.calculateWordCount(data.content));
    }
    if (data.summary !== undefined) {
      updates.push('summary = ?');
      values.push(data.summary);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id, projectId);

    db.prepare(`
      UPDATE chapters SET ${updates.join(', ')} WHERE id = ? AND project_id = ?
    `).run(...values);

    return this.findById(id, projectId);
  }

  reorder(projectId: string, chapterOrders: { id: string; order: number }[]): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE chapters SET chapter_order = ?, updated_at = ? WHERE id = ? AND project_id = ?
    `);

    const transaction = db.transaction(() => {
      for (const item of chapterOrders) {
        stmt.run(item.order, now, item.id, projectId);
      }
    });

    transaction();
  }

  delete(id: string, projectId: string): boolean {
    const result = db.prepare(`
      DELETE FROM chapters WHERE id = ? AND project_id = ?
    `).run(id, projectId);

    return result.changes > 0;
  }

  private calculateWordCount(text: string): number {
    return text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  }
}

export const chapterRepository = new ChapterRepository();
