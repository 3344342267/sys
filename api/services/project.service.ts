import { projectRepository } from '../repositories/project.repository';
import { chapterRepository } from '../repositories/chapter.repository';
import type { Project } from '../../shared/types';

export class ProjectService {
  createProject(userId: string, data: { title: string; description?: string; cover?: string; tags?: string[] }) {
    return projectRepository.create(userId, data);
  }

  getProjects(userId: string) {
    return projectRepository.findByUserId(userId);
  }

  getProject(id: string, userId: string) {
    const project = projectRepository.findById(id, userId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  updateProject(id: string, userId: string, data: Partial<{ title: string; description: string; cover: string; tags: string[] }>) {
    const project = projectRepository.update(id, userId, data);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  deleteProject(id: string, userId: string) {
    const deleted = projectRepository.delete(id, userId);
    if (!deleted) {
      throw new Error('Project not found');
    }
    return { success: true };
  }

  updateWordCount(projectId: string, wordCount: number) {
    projectRepository.updateWordCount(projectId, wordCount);
  }

  getProjectStats(id: string, userId: string) {
    const project = this.getProject(id, userId);
    const chapters = chapterRepository.findByProjectId(id);
    
    return {
      project,
      chapterCount: chapters.length,
      totalWordCount: chapters.reduce((sum, ch) => sum + ch.wordCount, 0),
      draftCount: chapters.filter(ch => ch.status === 'draft').length,
      publishedCount: chapters.filter(ch => ch.status === 'published').length
    };
  }
}

export const projectService = new ProjectService();
