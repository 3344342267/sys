import { chapterRepository } from '../repositories/chapter.repository';
import { projectRepository } from '../repositories/project.repository';
import type { Chapter } from '../../shared/types';

export class ChapterService {
  createChapter(projectId: string, userId: string, data: { title: string; content?: string; summary?: string; status?: string }) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const chapter = chapterRepository.create(projectId, data);
    this.updateProjectWordCount(projectId);
    return chapter;
  }

  getChapters(projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    return chapterRepository.findByProjectId(projectId);
  }

  getChapter(id: string, projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const chapter = chapterRepository.findById(id, projectId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
    return chapter;
  }

  updateChapter(id: string, projectId: string, userId: string, data: Partial<{ title: string; content: string; summary: string; status: string }>) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const chapter = chapterRepository.update(id, projectId, data);
    if (!chapter) {
      throw new Error('Chapter not found');
    }

    if (data.content !== undefined) {
      this.updateProjectWordCount(projectId);
    }

    return chapter;
  }

  reorderChapters(projectId: string, userId: string, chapterOrders: { id: string; order: number }[]) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    chapterRepository.reorder(projectId, chapterOrders);
    return { success: true };
  }

  deleteChapter(id: string, projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const deleted = chapterRepository.delete(id, projectId);
    if (!deleted) {
      throw new Error('Chapter not found');
    }

    this.updateProjectWordCount(projectId);
    return { success: true };
  }

  private updateProjectWordCount(projectId: string) {
    const chapters = chapterRepository.findByProjectId(projectId);
    const totalWordCount = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
    projectRepository.updateWordCount(projectId, totalWordCount);
  }
}

export const chapterService = new ChapterService();
