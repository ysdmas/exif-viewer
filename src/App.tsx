import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { ExifDisplay } from './components/ExifDisplay';
import { exifService } from './services/ExifService';
import type { ExifData } from './services/ExifrExtractor';
import './App.css';

function App() {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError('');
    setExifData(null);

    try {
      const data = await exifService.extractExif(file);
      setExifData(data);
      setFileName(file.name);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>EXIF Viewer</h1>
        <p>View EXIF information from your images</p>
      </header>

      <main className="app-main">
        <FileUploader 
          onFileSelect={handleFileSelect} 
          onError={handleError}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            Loading...
          </div>
        )}

        {exifData && !loading && (
          <ExifDisplay 
            exifData={exifData.raw} 
            fileName={fileName}
          />
        )}
      </main>
    </div>
  );
}

export default App;