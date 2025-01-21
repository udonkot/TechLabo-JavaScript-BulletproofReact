import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
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
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const windowWidth = window.innerWidth;

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

      // const filePath = URL.createObjectURL(file);
      // analyzeDocument(filePath);
    } else {
      setFileImg(null);
    }
  };


  //  pdfファイルを解析するメソッド
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  }

  // pdfファイルの読み込みエラー時のメソッド
  const onLoadError = (error: onLoadErrorType) => {
    console.error('Error while loading document:', error);
    setError(error.message);
  };

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }

  // pdfファイルを解析するメソッド
  const fileInput = React.createRef<HTMLInputElement>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '80%' }}>
        <label>1. ファイル選択</label>
        <form
          onSubmit={async (e) => {

            e.preventDefault();
            setAnalysisResult(null);
            setError('');
            setIsLoading(true);
            const formData = new FormData(e.target as HTMLFormElement);
            try {
              const response = await axios.post(
                import.meta.env.VITE_APP_BACKEND_FASTAPI_URL + '/analyze-pdf',
                formData,
                {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  }
                }
              );
              setAnalysisResult(response.data);
            } catch (error) {
              console.error('Error analyzing document:', error);
              setError('Error analyzing document');
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <input type="file" name="file" accept=".pdf" ref={fileInput} onChange={handleUploadImg} />

          {
            showPdf === true && (
              <div style={{
                width: "100%",
                height: "100%",
              }}>
                <div style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '80%' }}>
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
              </div>
            )
          }

          {
            showPdf === true && (
              <div style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '80%' }}>
                <label>2.キーワードを指定して「FASTAPI呼出」ボタンを押下</label>
                <div>
                  <label>キーワード：</label>
                  <input
                    type="text"
                    name="keyword"
                    onChange={onChangeKeyword}
                    style={{ border: '1px solid black', padding: '5px' }}
                  />
                </div>
                <br />
                <Button type="submit">FASTAPI呼出</Button>
              </div>
            )
          }

        </form>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {
        analysisResult && (
          <div style={{ overflowX: 'scroll', overflowY: 'scroll', maxWidth: '40vh', maxHeight: '40vh', border: '1px solid black', padding: '10px', margin: '10px', width: '100%', boxSizing: 'border-box' }}>
            <h2>実行結果(成功)</h2>
            <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
          </div>
        )
      }
      {
        error && (
          <div style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '80%' }}>
            <h2>実行結果(エラー)</h2>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )
      }
    </div>
  );
};

