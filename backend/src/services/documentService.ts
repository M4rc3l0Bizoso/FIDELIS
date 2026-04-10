/**
 * Document Service
 * Handles PDF extraction, image OCR, and text processing
 */

import * as fs from 'fs';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

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
  estimatedReadingTime: number; // minutes
  averageWordLength: number;
  averageSentenceLength: number;
}

export class DocumentService {
  /**
   * Extract text from PDF file
   */
  public async extractFromPDF(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;

      let fullText = '';
      const pageCount = pdf.numPages;

      // Extract text from each page
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += pageText + '\n';
      }

      const processingTime = Date.now() - startTime;

      return {
        text: fullText.trim(),
        language: 'es', // Detect language (Spanish assumed)
        pageCount,
        confidence: 0.95, // PDF extraction is generally reliable
        processingTime,
      };
    } catch (error) {
      throw new Error(`Failed to extract PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extract text from image using OCR
   */
  public async extractFromImage(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      const result = await Tesseract.recognize(filePath, 'spa+eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
          }
        },
      });

      const processingTime = Date.now() - startTime;

      return {
        text: result.data.text,
        language: 'es',
        confidence: result.data.confidence,
        processingTime,
      };
    } catch (error) {
      throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process plain text file
   */
  public async extractFromText(filePath: string): Promise<ExtractionResult> {
    const startTime = Date.now();

    try {
      const text = fs.readFileSync(filePath, 'utf-8');
      const processingTime = Date.now() - startTime;

      return {
        text: text.trim(),
        language: 'es',
        confidence: 1.0, // Text is exactly as provided
        processingTime,
      };
    } catch (error) {
      throw new Error(`Failed to read text file: ${error instanceof Error ? error.message : String(error)}`);
    }
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
    const totalSentences = sentences.length;
    const averageWordLength = words.reduce((sum, w) => sum + w.length, 0) / totalWords || 0;
    const averageSentenceLength = totalWords / totalSentences || 0;

    // Reading time: approximately 200-250 words per minute for academic texts
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
    return (
      text
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove special characters but keep punctuation
        .replace(/[^\w\s.!?áéíóúàèìòùäëïöüâêîôûã,;:-]/g, '')
        // Fix spacing around punctuation
        .replace(/\s+([.!?,;:])/g, '$1')
        .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
        .trim()
    );
  }

  /**
   * Segment text into paragraphs
   */
  public segmentParagraphs(text: string): string[] {
    return text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  }

  /**
   * Validate extracted text quality
   */
  public validateText(text: string, minWords: number = 10): boolean {
    const wordCount = text.split(/\s+/).length;
    const hasContent = text.trim().length > 0;
    const hasReasonableLength = wordCount >= minWords;

    return hasContent && hasReasonableLength;
  }
}

export default new DocumentService();
