import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, File, Sparkles, Loader2, Trash2, Brain, Info } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

interface DocumentUploadProps {
  onFilesAdded?: (files: File[]) => void;
}

export function DocumentUpload({ onFilesAdded }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map());

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  const processFiles = async (newFiles: File[]) => {
    onFilesAdded?.(newFiles);
    
    for (const file of newFiles) {
      const tempId = Math.random().toString(36).substr(2, 9);
      setUploadingFiles(prev => new Map(prev).set(tempId, 0));
      
      try {
        await uploadMutation.mutateAsync(file);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploadingFiles(prev => {
          const next = new Map(prev);
          next.delete(tempId);
          return next;
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="h-5 w-5 text-rose-500" />;
    if (type === "docx") return <File className="h-5 w-5 text-sky-500" />;
    if (type === "txt") return <FileText className="h-5 w-5 text-emerald-500" />;
    return <File className="h-5 w-5 text-amber-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge className="gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0">
            <CheckCircle className="h-3 w-3" />
            Ready
          </Badge>
        );
      case "processing":
        return (
          <Badge className="gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-0">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case "error":
        return (
          <Badge className="gap-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-0">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const readyDocs = documents.filter(d => d.status === "ready");
  const processingDocs = documents.filter(d => d.status === "processing");

  return (
    <div className="space-y-4">

      {readyDocs.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4" data-testid="banner-knowledge-base">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Knowledge base active — {readyDocs.length} document{readyDocs.length !== 1 ? "s" : ""} powering your chatbot
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Your AI agent reads all uploaded documents and uses them to answer customer questions accurately.
              The more you upload, the smarter it gets.
            </p>
          </div>
        </div>
      )}

      {processingDocs.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3" data-testid="banner-processing">
          <Loader2 className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Processing {processingDocs.length} document{processingDocs.length !== 1 ? "s" : ""}… This may take a moment.
          </p>
        </div>
      )}

      {documents.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-4" data-testid="banner-empty-kb">
          <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="text-sm text-sky-700 dark:text-sky-400">
            Upload your FAQs, product catalogue, return policy or any business document.
            Your chatbot will use this content to answer customers accurately.
          </p>
        </div>
      )}

      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center">
            <div className={`mb-4 p-4 rounded-2xl transition-all duration-200 ${
              isDragging 
                ? "bg-primary/20 scale-110" 
                : "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30"
            }`}>
              <Upload className={`h-8 w-8 transition-colors ${isDragging ? "text-primary" : "text-amber-600 dark:text-amber-400"}`} />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Drop your files here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
              <Badge variant="secondary" className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-0">PDF</Badge>
              <Badge variant="secondary" className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-0">DOCX</Badge>
              <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0">TXT</Badge>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              data-testid="input-file-upload"
            />
            <div className="flex gap-2 flex-wrap justify-center">
              <Button asChild disabled={uploadMutation.isPending}>
                <label htmlFor="file-upload" className="cursor-pointer" data-testid="button-browse-files">
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Browse Files
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden" data-testid={`file-item-${doc.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{doc.name}</span>
                      <Badge variant="outline">
                        {doc.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${doc.id}`}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">Upload documents to train your AI agent</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
