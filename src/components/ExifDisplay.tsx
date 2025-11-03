import React, { useState } from 'react';

interface ExifDisplayProps {
  exifData: Record<string, any>;
  fileName: string;
}

export const ExifDisplay: React.FC<ExifDisplayProps> = ({ exifData, fileName }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(exifData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (!exifData || Object.keys(exifData).length === 0) {
    return <p className="no-data">No EXIF data available</p>;
  }

  return (
    <div className="exif-display">
      <div className="section-header">
        <h2>{fileName} - EXIF Data (ExifTool)</h2>
        <button 
          className="copy-button"
          onClick={handleCopyToClipboard}
        >
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre className="json-display">
        {JSON.stringify(exifData, null, 2)}
      </pre>
    </div>
  );
};