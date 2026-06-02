import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';
import type { Element } from '../../shared/types';

export class ElementRepository {
  create(projectId: string, data: { type: string; name: string; content?: string; tags?: string[]; metadata?: any }): Element {
    const id = uuidv4();
    const tags = JSON.stringify(data.tags || []);
    const metadata = JSON.stringify(data.metadata || null);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO elements (id, project_id, type, name, content, tags, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, projectId, data.type, data.name, data.content || '', tags, metadata, now, now);

    return {
      id,
      projectId,
      type: data.type as 'world' | 'character' | 'item',
      name: data.name,
      content: data.content || '',
      tags: data.tags || [],
      metadata: data.metadata,
      createdAt: now,
      updatedAt: now
    };
  }

  findByProjectId(projectId: string): Element[] {
    const rows = db.prepare(`
      SELECT id, project_id, type, name, content, tags, metadata, created_at, updated_at
      FROM elements WHERE project_id = ?
      ORDER BY created_at DESC
    `).all(projectId) as any[];

    return rows.map(row => ({
      id: row.id,
      projectId: row.project_id,
      type: row.type as 'world' | 'character' | 'item',
      name: row.name,
      content: row.content,
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || 'null'),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  findById(id: string, projectId: string): Element | null {
    const row = db.prepare(`
      SELECT id, project_id, type, name, content, tags, metadata, created_at, updated_at
      FROM elements WHERE id = ? AND project_id = ?
    `).get(id, projectId) as any;

    if (!row) return null;

    return {
      id: row.id,
      projectId: row.project_id,
      type: row.type as 'world' | 'character' | 'item',
      name: row.name,
      content: row.content,
      tags: JSON.parse(row.tags || '[]'),
      metadata: JSON.parse(row.metadata || 'null'),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  update(id: string, projectId: string, data: Partial<{ type: string; name: string; content: string; tags: string[]; metadata: any }>): Element | null {
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.content !== undefined) {
      updates.push('content = ?');
      values.push(data.content);
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(data.tags));
    }
    if (data.metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(data.metadata));
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id, projectId);

    db.prepare(`
      UPDATE elements SET ${updates.join(', ')} WHERE id = ? AND project_id = ?
    `).run(...values);

    return this.findById(id, projectId);
  }

  delete(id: string, projectId: string): boolean {
    const result = db.prepare(`
      DELETE FROM elements WHERE id = ? AND project_id = ?
    `).run(id, projectId);

    return result.changes > 0;
  }
}

export const elementRepository = new ElementRepository();
