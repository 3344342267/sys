import { create } from 'zustand';
import type { Project, Chapter, Element } from '../../shared/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  chapters: Chapter[];
  currentChapter: Chapter | null;
  elements: Element[];
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setChapters: (chapters: Chapter[]) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setElements: (elements: Element[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (chapter: Chapter) => void;
  removeChapter: (id: string) => void;
  addElement: (element: Element) => void;
  updateElement: (element: Element) => void;
  removeElement: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  chapters: [],
  currentChapter: null,
  elements: [],
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setChapters: (chapters) => set({ chapters }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setElements: (elements) => set({ elements }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (project) => set((state) => ({
    projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    currentProject: state.currentProject?.id === project.id ? project : state.currentProject,
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
  addChapter: (chapter) => set((state) => ({ chapters: [...state.chapters, chapter] })),
  updateChapter: (chapter) => set((state) => ({
    chapters: state.chapters.map((c) => (c.id === chapter.id ? chapter : c)),
    currentChapter: state.currentChapter?.id === chapter.id ? chapter : state.currentChapter,
  })),
  removeChapter: (id) => set((state) => ({
    chapters: state.chapters.filter((c) => c.id !== id),
    currentChapter: state.currentChapter?.id === id ? null : state.currentChapter,
  })),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (element) => set((state) => ({
    elements: state.elements.map((e) => (e.id === element.id ? element : e)),
  })),
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((e) => e.id !== id),
  })),
}));
