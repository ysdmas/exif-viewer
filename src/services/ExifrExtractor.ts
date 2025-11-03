import exifr from 'exifr';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '../constants';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export interface ExifData {
  raw: Record<string, any>;
}

export class ExifrExtractor {
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
      // Add file information
      const fileInfo = {
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(0)} KB`,
        'File Modification Date/Time': new Date(file.lastModified).toLocaleString(),
        'File Type': file.type,
        'MIME Type': file.type
      };

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Parse EXIF data with comprehensive options based on exifr documentation
      const exifData = await exifr.parse(arrayBuffer, {
        // Enable all segments
        tiff: true,
        xmp: true,        // XMP metadata
        icc: true,        // ICC color profile
        iptc: true,       // IPTC metadata
        jfif: true,       // JFIF data (JPEG only)
        ihdr: true,       // PNG header (PNG only)
        
        // Enable all TIFF sub-blocks
        ifd0: true,       // Main image data
        ifd1: true,       // Thumbnail data
        exif: true,       // EXIF data
        gps: true,        // GPS coordinates
        interop: true,    // Interoperability data
        
        // Enable custom tags
        makerNote: true,    // Manufacturer-specific data
        userComment: true,  // User comments
        
        // Extended metadata support
        multiSegment: true, // Important for XMP Extended and multiple ICC segments
        
        // No filtering - extract everything
        skip: [],
        pick: [],
        
        // Formatting options for readable output
        translateKeys: true,
        translateValues: true,
        reviveValues: true,
        sanitize: true,
        mergeOutput: true,
        silentErrors: true
      });

      if (!exifData) {
        throw new Error(ERROR_MESSAGES.NO_EXIF_ERROR);
      }

      // Merge file info with EXIF data
      const allData = {
        ...fileInfo,
        ...exifData
      };

      return {
        raw: allData
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