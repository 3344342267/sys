import type { Request, Response } from 'express';
import { chapterService } from '../services/chapter.service';
import type { ApiResponse, Chapter } from '../../shared/types';

export async function getChapters(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId } = req.params;

    const chapters = chapterService.getChapters(projectId, user.userId);

    res.json({
      success: true,
      data: chapters
    } as ApiResponse<Chapter[]>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function createChapter(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId } = req.params;
    const { title, content, summary, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      } as ApiResponse);
    }

    const chapter = chapterService.createChapter(projectId, user.userId, { title, content, summary, status });

    res.status(201).json({
      success: true,
      data: chapter
    } as ApiResponse<Chapter>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function getChapter(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;

    const chapter = chapterService.getChapter(id, projectId, user.userId);

    res.json({
      success: true,
      data: chapter
    } as ApiResponse<Chapter>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function updateChapter(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;
    const { title, content, summary, status } = req.body;

    const chapter = chapterService.updateChapter(id, projectId, user.userId, { title, content, summary, status });

    res.json({
      success: true,
      data: chapter
    } as ApiResponse<Chapter>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function reorderChapters(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId } = req.params;
    const { orders } = req.body;

    chapterService.reorderChapters(projectId, user.userId, orders);

    res.json({
      success: true,
      data: { message: 'Chapters reordered successfully' }
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function deleteChapter(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;

    chapterService.deleteChapter(id, projectId, user.userId);

    res.json({
      success: true,
      data: { message: 'Chapter deleted successfully' }
    } as ApiResponse);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}
