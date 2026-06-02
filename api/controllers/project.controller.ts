import type { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import type { ApiResponse, Project } from '../../shared/types';

export async function getProjects(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const projects = projectService.getProjects(user.userId);

    res.json({
      success: true,
      data: projects
    } as ApiResponse<Project[]>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { title, description, cover, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      } as ApiResponse);
    }

    const project = projectService.createProject(user.userId, { title, description, cover, tags });

    res.status(201).json({
      success: true,
      data: project
    } as ApiResponse<Project>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const project = projectService.getProject(id, user.userId);

    res.json({
      success: true,
      data: project
    } as ApiResponse<Project>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { title, description, cover, tags } = req.body;

    const project = projectService.updateProject(id, user.userId, { title, description, cover, tags });

    res.json({
      success: true,
      data: project
    } as ApiResponse<Project>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    projectService.deleteProject(id, user.userId);

    res.json({
      success: true,
      data: { message: 'Project deleted successfully' }
    } as ApiResponse);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function getProjectStats(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const stats = projectService.getProjectStats(id, user.userId);

    res.json({
      success: true,
      data: stats
    } as ApiResponse);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}
