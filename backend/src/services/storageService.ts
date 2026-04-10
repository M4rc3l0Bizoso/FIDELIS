import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  private uploadsDir: string;

  constructor(uploadsDir: string = './uploads') {
    this.uploadsDir = uploadsDir;
    this.ensureDirectory(uploadsDir);
  }

  /**
   * Ensure directory exists
   */
  private ensureDirectory(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Save uploaded file
   */
  public saveFile(fileBuffer: Buffer, originalFilename: string): string {
    const fileId = uuidv4();
    const ext = path.extname(originalFilename);
    const filename = `${fileId}${ext}`;
    const filepath = path.join(this.uploadsDir, filename);

    fs.writeFileSync(filepath, fileBuffer);
    return filepath;
  }

  /**
   * Save file from base64
   */
  public saveBase64File(base64Data: string, mimeType: string): string {
    const fileId = uuidv4();
    const ext = this.getExtensionFromMimeType(mimeType);
    const filename = `${fileId}${ext}`;
    const filepath = path.join(this.uploadsDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);
    return filepath;
  }

  /**
   * Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/gif': '.gif',
      'text/plain': '.txt',
    };
    return mimeMap[mimeType] || '.tmp';
  }

  /**
   * Read file
   */
  public readFile(filepath: string): Buffer {
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    return fs.readFileSync(filepath);
  }

  /**
   * Delete file
   */
  public deleteFile(filepath: string): boolean {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete file: ${filepath}`, error);
      return false;
    }
  }

  /**
   * File exists check
   */
  public fileExists(filepath: string): boolean {
    return fs.existsSync(filepath);
  }

  /**
   * Get file size
   */
  public getFileSize(filepath: string): number {
    if (!fs.existsSync(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    const stats = fs.statSync(filepath);
    return stats.size;
  }

  /**
   * Clean up old files (optional maintenance)
   */
  public cleanupOldFiles(ageInHours: number = 24): void {
    const now = Date.now();
    const maxAge = ageInHours * 60 * 60 * 1000;

    try {
      const files = fs.readdirSync(this.uploadsDir);
      for (const file of files) {
        const filepath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          fs.unlinkSync(filepath);
          console.log(`Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error);
    }
  }
}

export default new StorageService(process.env.UPLOAD_DIR || './uploads');
