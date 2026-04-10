import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import documentService from '../services/documentService';
import storageService from '../services/storageService';

export class DocumentController {
  /**
   * Upload and process document file
   */
  async uploadDocument(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      const { documentType } = req.body;
      if (!['pdf', 'image', 'text'].includes(documentType)) {
        return res.status(400).json({ success: false, error: 'Invalid document type' });
      }

      // Save file
      const storagePath = storageService.saveFile(req.file.buffer, req.file.originalname);

      // Extract text based on type
      const startTime = Date.now();
      const extraction = await documentService.extractFromFile(storagePath);
      const processingTime = Date.now() - startTime;

      // Validate extracted text
      if (!documentService.validateText(extraction.text)) {
        storageService.deleteFile(storagePath);
        return res.status(400).json({
          success: false,
          error: 'Could not extract meaningful text from document',
        });
      }

      // Clean text
      const cleanedText = documentService.cleanText(extraction.text);
      const textStats = documentService.getTextStats(cleanedText);

      const document = {
        id: uuidv4(),
        userId: req.user.id,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        extractedText: cleanedText,
        language: extraction.language,
        pageCount: extraction.pageCount,
        uploadedAt: new Date().toISOString(),
        storagePath,
        ...textStats,
        confidence: extraction.confidence,
        processingTime,
      };

      return res.json({
        success: true,
        data: document,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process document',
      });
    }
  }

  /**
   * Upload plain text
   */
  async uploadText(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Text is required' });
      }

      if (text.length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Text must be at least 50 characters',
        });
      }

      // Clean text
      const cleanedText = documentService.cleanText(text);
      const textStats = documentService.getTextStats(cleanedText);

      const document = {
        id: uuidv4(),
        userId: req.user.id,
        filename: 'Pasted Text',
        mimeType: 'text/plain',
        fileSize: cleanedText.length,
        extractedText: cleanedText,
        language: 'es',
        uploadedAt: new Date().toISOString(),
        storagePath: null,
        confidence: 1.0,
        processingTime: 0,
        ...textStats,
      };

      return res.json({
        success: true,
        data: document,
      });
    } catch (error: any) {
      console.error('Text upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process text',
      });
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;

      // In a real app, fetch from database
      // For now, return placeholder

      res.json({
        success: true,
        data: {
          id,
          message: 'Document retrieved',
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get document',
      });
    }
  }

  /**
   * Get user's document history
   */
  async getDocumentHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      // In a real app, fetch from database
      // For now, return empty array

      res.json({
        success: true,
        data: [],
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get history',
      });
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;

      // In a real app, delete from database and storage
      // For now, return success

      res.json({
        success: true,
        message: 'Document deleted',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete document',
      });
    }
  }
}

export default new DocumentController();
