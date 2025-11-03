import { ExifrExtractor } from './ExifrExtractor';
import type { ExifData } from './ExifrExtractor';
import { ExiftoolExtractor } from './ExiftoolExtractor';

const USE_EXIFTOOL = true; // Switch to true to use exiftool

export class ExifService {
  private extractor: ExifrExtractor | ExiftoolExtractor;

  constructor() {
    this.extractor = USE_EXIFTOOL 
      ? new ExiftoolExtractor() 
      : new ExifrExtractor();
  }

  async extractExif(file: File): Promise<ExifData> {
    try {
      return await this.extractor.extractExif(file);
    } catch (error) {
      // Re-throw the error with appropriate message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const exifService = new ExifService();