import { elementRepository } from '../repositories/element.repository';
import { projectRepository } from '../repositories/project.repository';
import type { Element } from '../../shared/types';

export class ElementService {
  createElement(projectId: string, userId: string, data: { type: string; name: string; content?: string; tags?: string[]; metadata?: any }) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    return elementRepository.create(projectId, data);
  }

  getElements(projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    return elementRepository.findByProjectId(projectId);
  }

  getElement(id: string, projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const element = elementRepository.findById(id, projectId);
    if (!element) {
      throw new Error('Element not found');
    }
    return element;
  }

  updateElement(id: string, projectId: string, userId: string, data: Partial<{ type: string; name: string; content: string; tags: string[]; metadata: any }>) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const element = elementRepository.update(id, projectId, data);
    if (!element) {
      throw new Error('Element not found');
    }
    return element;
  }

  deleteElement(id: string, projectId: string, userId: string) {
    const project = projectRepository.findById(projectId, userId);
    if (!project) {
      throw new Error('Project not found');
    }

    const deleted = elementRepository.delete(id, projectId);
    if (!deleted) {
      throw new Error('Element not found');
    }
    return { success: true };
  }

  getElementsByType(projectId: string, userId: string, type: string) {
    const elements = this.getElements(projectId, userId);
    return elements.filter(el => el.type === type);
  }
}

export const elementService = new ElementService();
