import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Alert, Button, CircularProgress } from "@mui/material";
import { FileUploadAlert } from "../components/FileUploadAlert";

export default function UploadView() {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [hasUploaded, setHasUploaded] = React.useState<boolean>(false);
  const [didRetrieveFile, setDidRetrieveFile] = React.useState<boolean>(false);
  const [lastUploadedRecord, setLastUploadedRecord] = React.useState<any>();
  const [errorWhenFetchingLast, setErrorWhenFetchingLast] =
    React.useState<boolean>(false);
  const [processedFileData, setProcessedFileData] = React.useState<any>();

  const handleChange = (fileList: FileList | null) => {
    if (fileList) {
      setFile(fileList[0]);
    }
    console.log(file);
  };

  const uploadShipmentFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8080/process_shipment_file",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Response from server: ", response);

      const data = await response.json();
      console.log("Data from server: ", data);
      setStatus("success");
      localStorage.setItem('filename', data.file_id)

      setTimeout(() => {
        fetchIfRecordProcessed();
      }, 2000);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Now handling file submit");

    if (file?.type !== "text/plain") {
      setStatus("invalid-file-type");
    } else {
      uploadShipmentFile(file);
    }

    setHasUploaded(true);

    setFile(null);
  };

  const fetchIfRecordProcessed = async () => {
    while (true) {
      const response = await fetch(
        `http://localhost:8080/download/${localStorage.getItem('filename')}`,
        {
          method: "GET"
        }
      );
      if (response.status != 200) {
        setIsUploading(false);
        setErrorWhenFetchingLast(true);
        break;
      }
      else{
        const data = await response.json();
        console.log("Data from fetch of record processed: ", data);
        if (data.historic != null){
          const filename = data.file.filename;
          const mediaType = data.file.media_type;
          const path = data.file.path;
          const headers = data.file._headers;
        
          const response = {
            headers: headers,
            async blob() {
              const blob = new Blob([path], { type: mediaType });
              return blob;
            }
          };
        
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);

          console.log("Data from fetch of record processed: ", data);
          setProcessedFileData(data);
          setIsUploading(false);
          setDidRetrieveFile(true);
          break;
        }
      }
    }

    return;
  };

  const resetUploadStatus = () => {
    setHasUploaded(false);
  };

  return (
    <>
      <form className="flex items-center space-x-6">
        <div className="shrink-0">
          <UploadFileIcon className="h-10 w-10" />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            className="block text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:font-semibold
              file:bg-blue-50 file:text-black-700
              hover:file:bg-blue-100"
            accept="text/plain"
            onChange={(e) => handleChange(e.target.files)}
          />
        </label>
        <Button
          type="submit"
          variant="outlined"
          onClick={(e) => handleFileSubmit(e)}
          disabled={!file}
        >
          Enviar
        </Button>
      </form>
      {hasUploaded && (
        <FileUploadAlert onClose={resetUploadStatus} status={status} />
      )}
      {isUploading && (
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "14px" }}
        >
          <CircularProgress size={"1.5rem"} sx={{ marginRight: "16px" }} />
          Aguarde... gerando arquivo de retorno.
        </div>
      )}
      {errorWhenFetchingLast && (
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "14px" }}
        >
          <Alert severity="error">
            Houve um erro ao gerar o arquivo de retorno. Por favor verifique o
            histórico.
          </Alert>
        </div>
      )}
      {processedFileData && (
        <p>Código QR Code de retorno: {processedFileData.historic.qr_code_string}</p>
      )}
    </>
  );
}
