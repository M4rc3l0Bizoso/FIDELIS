import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth';
import summarizerService from '../services/summarizerService';

export class SummaryController {
  /**
   * Generate summary from document
   */
  async generateSummary(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { documentId, compressionRatio = 0.3, includeKeyPoints = true } = req.body;

      if (!documentId) {
        return res.status(400).json({ success: false, error: 'Document ID is required' });
      }

      if (compressionRatio < 0.1 || compressionRatio > 0.9) {
        return res.status(400).json({
          success: false,
          error: 'Compression ratio must be between 0.1 and 0.9',
        });
      }

      // In a real app, fetch document from database
      // For now, get from request or mock data
      const originalText = req.body.originalText || 'Sample text for summarization';

      const startTime = Date.now();

      // Generate summary using extractive algorithm
      const result = summarizerService.summarize(originalText, compressionRatio);

      const processingTime = Date.now() - startTime;

      const summary = {
        id: uuidv4(),
        documentId,
        userId: req.user.id,
        originalText: result.originalText,
        summaryText: result.summaryText,
        keyPoints: includeKeyPoints ? result.keyPoints : [],
        compressionRatio: result.compressionRatio,
        confidenceScore: result.confidenceScore,
        wordCount: result.wordCount,
        sentenceCount: result.sentenceCount,
        generatedAt: new Date().toISOString(),
        metadata: {
          processingTime,
          method: 'extractive',
          language: 'es',
        },
      };

      return res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      console.error('Summarization error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate summary',
      });
    }
  }

  /**
   * Get summary by ID
   */
  async getSummary(req: AuthRequest, res: Response) {
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
          message: 'Summary retrieved',
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get summary',
      });
    }
  }

  /**
   * Regenerate summary with different compression ratio
   */
  async regenerateSummary(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { compressionRatio = 0.3, originalText } = req.body;

      if (!originalText) {
        return res.status(400).json({ success: false, error: 'Original text is required' });
      }

      const startTime = Date.now();

      // Generate new summary
      const result = summarizerService.summarize(originalText, compressionRatio);

      const processingTime = Date.now() - startTime;

      const summary = {
        id,
        summaryText: result.summaryText,
        keyPoints: result.keyPoints,
        compressionRatio: result.compressionRatio,
        confidenceScore: result.confidenceScore,
        wordCount: result.wordCount,
        sentenceCount: result.sentenceCount,
        updatedAt: new Date().toISOString(),
        metadata: {
          processingTime,
          method: 'extractive',
        },
      };

      return res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      console.error('Regeneration error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to regenerate summary',
      });
    }
  }

  /**
   * Export summary
   */
  async exportSummary(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { format = 'txt' } = req.query;

      if (!['pdf', 'txt'].includes(format as string)) {
        return res.status(400).json({ success: false, error: 'Invalid format' });
      }

      // In a real app, fetch summary from database
      const summaryText = 'Sample summary text';

      if (format === 'txt') {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="summary.txt"');
        res.send(summaryText);
      } else if (format === 'pdf') {
        // In a real app, use a PDF library to generate PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="summary.pdf"');
        res.send(Buffer.from(summaryText));
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to export summary',
      });
    }
  }

  /**
   * Create share link
   */
  async shareSummary(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { id } = req.params;

      // Generate share token
      const shareToken = uuidv4();
      const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${shareToken}`;

      // In a real app, save share token to database

      res.json({
        success: true,
        data: {
          shareUrl,
          shareToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create share link',
      });
    }
  }
}

export default new SummaryController();
