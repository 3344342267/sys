import { Router } from 'express';
import { getProjects, createProject, getProject, updateProject, deleteProject, getProjectStats } from '../controllers/project.controller';
import { getChapters, createChapter, getChapter, updateChapter, reorderChapters, deleteChapter } from '../controllers/chapter.controller';
import { getElements, createElement, getElement, updateElement, deleteElement } from '../controllers/element.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.get('/projects/:id/stats', getProjectStats);

router.get('/projects/:projectId/chapters', getChapters);
router.post('/projects/:projectId/chapters', createChapter);
router.get('/projects/:projectId/chapters/:id', getChapter);
router.put('/projects/:projectId/chapters/:id', updateChapter);
router.put('/projects/:projectId/chapters/reorder', reorderChapters);
router.delete('/projects/:projectId/chapters/:id', deleteChapter);

router.get('/projects/:projectId/elements', getElements);
router.post('/projects/:projectId/elements', createElement);
router.get('/projects/:projectId/elements/:id', getElement);
router.put('/projects/:projectId/elements/:id', updateElement);
router.delete('/projects/:projectId/elements/:id', deleteElement);

export default router;
