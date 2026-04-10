import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { AuthRequest, generateToken } from '../middleware/auth';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, fullName } = req.body;

      // Validate input
      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, and full name are required',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
        });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters long',
        });
      }

      // In a real app, check if user already exists in database
      // For now, just hash password and create user object

      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id: userId,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      };

      // Generate token
      const token = generateToken(userId, email);

      // In a real app, save user to database

      return res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Registration failed',
      });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      // In a real app, fetch user from database
      // For now, mock user
      const mockUser = {
        id: uuidv4(),
        email,
        fullName: 'Test User',
        passwordHash: await bcrypt.hash(password, 10),
      };

      // Verify password
      const validPassword = await bcrypt.compare(password, mockUser.passwordHash);

      if (!validPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      // Generate token
      const token = generateToken(mockUser.id, mockUser.email);

      const user = {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
      };

      return res.json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Login failed',
      });
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // In a real app, fetch user from database
      const user = {
        id: req.user.id,
        email: req.user.email,
        fullName: 'Current User',
      };

      return res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get user',
      });
    }
  }

  /**
   * Logout user
   */
  async logout(req: AuthRequest, res: Response) {
    try {
      // In a real app, invalidate token (e.g., add to blacklist)
      return res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Logout failed',
      });
    }
  }
}

export default new AuthController();
