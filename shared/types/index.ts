export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  cover?: string;
  tags: string[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  content: string;
  summary?: string;
  status: 'draft' | 'review' | 'published';
  order: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Element {
  id: string;
  projectId: string;
  type: 'world' | 'character' | 'item';
  name: string;
  content: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SyncRecord {
  id: string;
  projectId: string;
  operation: string;
  data: any;
  syncedAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  cover?: string;
  tags?: string[];
}

export interface ChapterCreateRequest {
  title: string;
  content?: string;
  summary?: string;
  status?: 'draft' | 'review' | 'published';
}

export interface ElementCreateRequest {
  type: 'world' | 'character' | 'item';
  name: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AIContinueRequest {
  projectId: string;
  chapterId?: string;
  context: string;
  style?: 'normal' | 'passionate' | 'romantic' | 'suspense';
  maxLength?: number;
}

export interface AIContinueResponse {
  content: string;
  reason: string;
}
