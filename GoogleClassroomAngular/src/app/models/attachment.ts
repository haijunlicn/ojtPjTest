export interface Attachment {
    fileUrl: string;          // Required: URL of the uploaded file (e.g., from ImageKit)
    fileName: string;         // Required: Original or stored filename
    fileType: string;         // Required: MIME type like "image/png", "application/pdf"
    fileSize?: number;        // Optional: Size in bytes
    thumbnailUrl?: string;    // Optional: For previewing large files like videos or PDFs
}
