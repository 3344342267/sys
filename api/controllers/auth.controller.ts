import type { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import type { ApiResponse, User } from '../../shared/types';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and nickname are required'
      } as ApiResponse);
    }

    const result = await authService.register(email, password, nickname);

    res.status(201).json({
      success: true,
      data: result
    } as ApiResponse);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse);
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result
    } as ApiResponse);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}

export async function logout(req: Request, res: Response) {
  res.json({
    success: true,
    data: { message: 'Logged out successfully' }
  } as ApiResponse);
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const fullUser = await authService.getUserById(user.userId);

    res.json({
      success: true,
      data: fullUser
    } as ApiResponse<User>);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message
    } as ApiResponse);
  }
}
