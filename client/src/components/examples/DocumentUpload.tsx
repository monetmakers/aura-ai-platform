import { DocumentUpload } from "../DocumentUpload";

export default function DocumentUploadExample() {
  return <DocumentUpload onFilesAdded={(files) => console.log("Files added:", files)} />;
}
