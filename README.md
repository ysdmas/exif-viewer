# EXIF Viewer

A web-based EXIF metadata viewer that runs entirely in your browser using WebAssembly-powered ExifTool.

## Features

- 🔒 **Privacy-focused**: All processing happens locally in your browser - no files are uploaded to servers
- 🚀 **Powered by ExifTool**: Uses the industry-standard ExifTool via WebAssembly for comprehensive metadata extraction
- 📊 **Complete metadata**: Extract all EXIF, IPTC, XMP, GPS, and custom metadata fields
- 🌐 **No server required**: Pure client-side application with no backend dependencies
- 📋 **Copy to clipboard**: Easy JSON export functionality

## Security & Privacy

### 🔐 Your files never leave your device

This application is designed with privacy as the top priority:

- **100% client-side processing**: All image analysis happens locally in your browser using WebAssembly
- **No file uploads**: Your images are never sent to any server or external service
- **No data collection**: We don't track, store, or have access to your files or metadata
- **Offline capable**: Once loaded, the app can work without an internet connection
- **Open source**: Full source code is available for inspection

### How it works

1. You select an image file using the file picker
2. The file is processed entirely within your browser using WebAssembly ExifTool
3. Metadata is extracted and displayed as JSON
4. Your original file remains on your device and is never transmitted anywhere

## Supported Formats

- JPEG/JPG
- PNG
- TIFF
- And other formats supported by ExifTool

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **EXIF Processing**: [@uswriting/exiftool](https://www.npmjs.com/package/@uswriting/exiftool) (WebAssembly ExifTool 13.30)
- **Styling**: CSS3
- **Build Tool**: Vite

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ExifDisplay.tsx  # EXIF data display component
│   └── FileUploader.tsx # File upload component
├── services/           # Core services
│   ├── ExifService.ts  # Main service orchestrator
│   ├── ExifrExtractor.ts    # exifr-based extractor (fallback)
│   └── ExiftoolExtractor.ts # WebAssembly ExifTool extractor
├── utils/              # Utility functions
└── constants.ts        # Application constants
```
