import type { Request, Response } from 'express';
import { elementService } from '../services/element.service';
import type { ApiResponse, Element } from '../../shared/types';

export async function getElements(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId } = req.params;
    const { type } = req.query;

    let elements;
    if (type) {
      elements = elementService.getElementsByType(projectId, user.userId, type as string);
    } else {
      elements = elementService.getElements(projectId, user.userId);
    }

    res.json({
      success: true,
      data: elements
    } as ApiResponse<Element[]>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function createElement(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId } = req.params;
    const { type, name, content, tags, metadata } = req.body;

    if (!type || !name) {
      return res.status(400).json({
        success: false,
        error: 'Type and name are required'
      } as ApiResponse);
    }

    if (!['world', 'character', 'item'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be one of: world, character, item'
      } as ApiResponse);
    }

    const element = elementService.createElement(projectId, user.userId, { type, name, content, tags, metadata });

    res.status(201).json({
      success: true,
      data: element
    } as ApiResponse<Element>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function getElement(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;

    const element = elementService.getElement(id, projectId, user.userId);

    res.json({
      success: true,
      data: element
    } as ApiResponse<Element>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function updateElement(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;
    const { type, name, content, tags, metadata } = req.body;

    if (type && !['world', 'character', 'item'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be one of: world, character, item'
      } as ApiResponse);
    }

    const element = elementService.updateElement(id, projectId, user.userId, { type, name, content, tags, metadata });

    res.json({
      success: true,
      data: element
    } as ApiResponse<Element>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function deleteElement(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { projectId, id } = req.params;

    elementService.deleteElement(id, projectId, user.userId);

    res.json({
      success: true,
      data: { message: 'Element deleted successfully' }
    } as ApiResponse);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}
