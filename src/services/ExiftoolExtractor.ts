import { parseMetadata } from '@uswriting/exiftool';
import type { ExifData } from './ExifrExtractor';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '../constants';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class ExiftoolExtractor {
  private parseExiftoolOutput(output: string): Record<string, any> {
    const lines = output.split('\n').filter(line => line.trim());
    const parsed: Record<string, any> = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Fix encoding issues for Japanese characters
      try {
        if (value.includes('ã') && value.includes('¿') && value.includes('â')) {
          // Attempt to fix common UTF-8 encoding issues
          value = decodeURIComponent(escape(value));
        }
      } catch (e) {
        // If decoding fails, keep original value
      }
      
      // Include fields even if value is empty (only require key to exist)
      if (key) {
        parsed[key] = value || '';
      }
    }

    return parsed;
  }

  private fixFileTimestamps(data: Record<string, any>, file: File): Record<string, any> {
    const modificationDate = new Date(file.lastModified);
    const formattedDate = modificationDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '+09:00');
    const exiftoolFormat = formattedDate.replace(/-/g, ':').substring(0, 19);
    
    // Fix file timestamps that are invalid in WebAssembly environment
    const fixed = { ...data };
    
    if (fixed['File Modification Date/Time'] === '0000:00:00 00:00:00') {
      fixed['File Modification Date/Time'] = exiftoolFormat + '+09:00';
    }
    
    if (fixed['File Access Date/Time'] === '0000:00:00 00:00:00') {
      fixed['File Access Date/Time'] = exiftoolFormat + '+09:00';
    }
    
    // Fix Unix epoch timestamps
    if (fixed['File Inode Change Date/Time']?.startsWith('1970:01:01')) {
      fixed['File Inode Change Date/Time'] = exiftoolFormat + '+09:00';
    }
    
    return fixed;
  }

  async extractExif(file: File): Promise<ExifData> {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(ERROR_MESSAGES.FILE_TYPE_ERROR);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(ERROR_MESSAGES.FILE_SIZE_ERROR);
    }

    try {
      const result = await parseMetadata(file);
      
      if (!result.success) {
        throw new Error(result.error || ERROR_MESSAGES.PARSE_ERROR);
      }

      if (!result.data) {
        throw new Error(ERROR_MESSAGES.NO_EXIF_ERROR);
      }

      // Parse the string output to JSON format
      let parsedData: Record<string, any>;
      
      if (typeof result.data === 'string') {
        parsedData = this.parseExiftoolOutput(result.data);
      } else {
        parsedData = result.data;
      }

      if (Object.keys(parsedData).length === 0) {
        throw new Error(ERROR_MESSAGES.NO_EXIF_ERROR);
      }

      // Fix file timestamps using browser File object
      const fixedData = this.fixFileTimestamps(parsedData, file);

      return {
        raw: fixedData
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ERROR_MESSAGES.NO_EXIF_ERROR) {
          throw error;
        }
        throw new Error(ERROR_MESSAGES.PARSE_ERROR);
      }
      throw new Error(ERROR_MESSAGES.READ_ERROR);
    }
  }
}