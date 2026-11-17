import { useState, type ChangeEvent, type DragEvent } from 'react';
import { AlertCircle, Check, FileText, UploadCloud } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';

interface UploadedFile {
  id: string;
  name: string;
}

export const FileUploads = () => {
  const { uploadFile, uploading, progress, error, success } = useFileUpload();
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFiles = (files: FileList | File[]) => {
    if (files.length === 0) return;
    const selectedFiles = Array.from(files);
    if (selectedFiles.some((file) => !file.name.toLowerCase().endsWith('.pdf'))) {
      setValidationError('Only PDF files are allowed. Please select .pdf files.');
      return;
    }

    setValidationError(null);
    void uploadFile(selectedFiles).then((uploaded) => {
      if (uploaded) {
        setUploadedFiles((currentFiles) => [
          ...selectedFiles.map((file, index) => ({
            id: `${Date.now()}-${index}-${file.name}-${file.size}`,
            name: file.name,
          })),
          ...currentFiles,
        ]);
      }
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) handleFiles(event.target.files);
    event.target.value = '';
  };

  return (
    <section className="upload-section" aria-label="Knowledge base files">
      <div className="upload-summary">
        <div className="upload-summary-icon"><FileText size={17} /></div>
        <div>
          <strong>Your documents</strong>
          <span>{uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} added</span>
        </div>
      </div>

      <div
        className={`upload-dropzone ${dragOver ? 'is-dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="visually-hidden"
          onChange={handleChange}
          accept=".pdf,application/pdf"
          multiple
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="upload-label">
          <span className="upload-cloud-icon"><UploadCloud size={19} /></span>
          <span className="upload-main-label">{uploading ? 'Adding PDFs…' : 'Add PDF documents'}</span>
          <span className="upload-sub-label">Drop PDFs or browse</span>
        </label>
      </div>
      <p className="file-format-note">PDF only</p>

      {uploading && (
        <div className="upload-progress" aria-live="polite">
          <div className="upload-progress-label"><span>Uploading</span><span>{progress}%</span></div>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      {(validationError || error) && (
        <p className="upload-error" role="alert">
          <AlertCircle size={14} />{validationError || error}
        </p>
      )}

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <p className="uploaded-heading">RECENTLY ADDED</p>
          {uploadedFiles.map((file) => (
            <div className="uploaded-file" key={file.id}>
              <span className="uploaded-file-icon"><FileText size={15} /></span>
              <span className="uploaded-file-name" title={file.name}>{file.name}</span>
              <Check size={14} className="uploaded-check" aria-label="Uploaded" />
            </div>
          ))}
        </div>
      )}
      {!uploading && success && !validationError && (
        <span className="upload-success"><Check size={13} /> Documents added</span>
      )}
    </section>
  );
};
