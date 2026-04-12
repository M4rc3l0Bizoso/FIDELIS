/**
 * Document Service
 * Handles PDF extraction, image OCR, and text processing
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ExtractionResult {
  text: string;
  language: string;
  pageCount?: number;
  confidence?: number;
  processingTime: number;
}

export interface TextStats {
  totalWords: number;
  totalSentences: number;
  paragraphs: number;
  estimatedReadingTime: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

export class DocumentService {
  /**
   * Extract text from PDF file
   * Uses pdfjs-dist when available, falls back to reading raw text
   */
  public async extractFromPDF(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      // Dynamic import to avoid build-time failures
      const pdfjsLib = await import('pdfjs-dist');
      const fileBuffer = fs.readFileSync(filePath);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;

      let fullText = '';
      const pageCount = pdf.numPages;

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return {
        text: fullText.trim(),
        language: 'es',
        pageCount,
        confidence: 0.95,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      // Fallback: try reading as raw text
      console.warn('PDF.js extraction failed, trying raw text fallback:', error);
      const raw = fs.readFileSync(filePath, 'utf-8');
      return {
        text: raw.trim(),
        language: 'es',
        confidence: 0.5,
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Extract text from image using OCR
   */
  public async extractFromImage(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(filePath, 'spa+eng');

      return {
        text: result.data.text,
        language: 'es',
        confidence: result.data.confidence,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(
        `OCR extraction failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Process plain text file
   */
  public async extractFromText(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();
    const text = fs.readFileSync(filePath, 'utf-8');

    return {
      text: text.trim(),
      language: 'es',
      confidence: 1.0,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Auto-detect file type and extract text
   */
  public async extractFromFile(filePath: string): Promise<ExtractionResult> {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.extractFromPDF(filePath);
      case '.txt':
      case '.md':
        return this.extractFromText(filePath);
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.bmp':
        return this.extractFromImage(filePath);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * Calculate text statistics
   */
  public getTextStats(text: string): TextStats {
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);

    const totalWords = words.length;
    const totalSentences = Math.max(sentences.length, 1);
    const averageWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / Math.max(totalWords, 1);
    const averageSentenceLength = totalWords / totalSentences;
    const estimatedReadingTime = Math.ceil(totalWords / 200);

    return {
      totalWords,
      totalSentences,
      paragraphs: paragraphs.length,
      estimatedReadingTime,
      averageWordLength: Math.round(averageWordLength * 100) / 100,
      averageSentenceLength: Math.round(averageSentenceLength * 100) / 100,
    };
  }

  /**
   * Clean and normalize text
   */
  public cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.!?áéíóúàèìòùäëïöüâêîôûãñ,;:\-()'"]/g, '')
      .replace(/\s+([.!?,;:])/g, '$1')
      .replace(/([.!?])\s*([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
      .trim();
  }

  /**
   * Validate extracted text quality
   */
  public validateText(text: string, minWords: number = 10): boolean {
    const wordCount = text.split(/\s+/).length;
    return text.trim().length > 0 && wordCount >= minWords;
  }
}

export default new DocumentService();
