import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import authController from '../controllers/authController';
import documentController from '../controllers/documentController';
import summaryController from '../controllers/summaryController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.get('/auth/me', authenticateToken, (req, res) => authController.getCurrentUser(req, res));
router.post('/auth/logout', authenticateToken, (req, res) => authController.logout(req, res));

// Document routes
router.post('/documents/upload', authenticateToken, (req, res) => {
  documentController.uploadDocument(req, res);
});
router.post('/documents/upload-text', authenticateToken, (req, res) => {
  documentController.uploadText(req, res);
});
router.get('/documents/:id', authenticateToken, (req, res) => {
  documentController.getDocument(req, res);
});
router.get('/documents/history', authenticateToken, (req, res) => {
  documentController.getDocumentHistory(req, res);
});
router.delete('/documents/:id', authenticateToken, (req, res) => {
  documentController.deleteDocument(req, res);
});

// Summary routes
router.post('/summaries/generate', authenticateToken, (req, res) => {
  summaryController.generateSummary(req, res);
});
router.get('/summaries/:id', authenticateToken, (req, res) => {
  summaryController.getSummary(req, res);
});
router.post('/summaries/:id/regenerate', authenticateToken, (req, res) => {
  summaryController.regenerateSummary(req, res);
});
router.get('/summaries/:id/export', authenticateToken, (req, res) => {
  summaryController.exportSummary(req, res);
});
router.post('/summaries/:id/share', authenticateToken, (req, res) => {
  summaryController.shareSummary(req, res);
});

export default router;
