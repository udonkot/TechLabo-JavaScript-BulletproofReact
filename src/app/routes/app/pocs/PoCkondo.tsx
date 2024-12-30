import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';

// pdfjs のワーカーを設定
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export type onLoadErrorType = {
  message: string
}

export const PoCkondo = () => {
  const [fileImg, setFileImg] = useState<string | ArrayBuffer | null>(null);
  const [showPdf, isShowPdf] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [pageNumber, setPageNumber] = useState(1);

  // アップロードされた画像をフックに保存するメソッド
  const handleUploadImg = (e: { target: { files: any; }; }) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      console.log(reader);
      reader.onload = (e) => {
        if (e.target !== null) {
          setFileImg(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      isShowPdf(true)
    } else {
      setFileImg(null);
    }
  };

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  }

  const onLoadError = (error: onLoadErrorType) => {
    console.error('Error while loading document:', error);
    setError(error.message);
  };

  return (
    <div>
      <div className="show_png">
        <input type="file" accept=".pdf" onChange={handleUploadImg} />
      </div>

      {showPdf === true && (
        <div style={{
          width: "100%",
          height: "100%",
        }}>
          <Document
            file={fileImg}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
          >
            <Page pageNumber={pageNumber} width={windowWidth * 0.4} />
          </Document>
          <p>
            Page {pageNumber} of {totalPages}
          </p>
          <Button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={pageNumber >= totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
