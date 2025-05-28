import { Component, Input } from '@angular/core';
import { ImageKitService } from '../../image-kit.service';
import { WebSocketService } from '../../websocket.service';

@Component({
  selector: 'app-chat-file-upload',
  standalone: false,
  templateUrl: './chat-file-upload.component.html',
  styleUrls: ['./chat-file-upload.component.css'],
})
export class ChatFileUploadComponent {
  @Input() groupId!: number;
  @Input() senderEmail!: string;
  @Input() senderName!: string;

  uploadProgress: string | null = null;

  constructor(
    private imageKitService: ImageKitService,
    private webSocketService: WebSocketService
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !this.groupId || !this.senderEmail) return;

    this.uploadProgress = 'Uploading...';

    this.imageKitService.uploadFile(file).subscribe({
      next: (res: any) => {
        this.uploadProgress = 'Upload successful!';

        const message = {
          content: '', // No text content, just file attachment
          groupId: this.groupId,
          sender: {
            email: this.senderEmail,
            name: this.senderName,
          },
          attachments: [
            {
              fileUrl: res.url,
              fileType: file.type,
              fileName: file.name,
              fileSize: file.size,
            },
          ],
          timestamp: new Date().toISOString(),
        };

        this.webSocketService.sendMessage(message);
      },
      error: (err: any) => {
        this.uploadProgress = 'Upload failed.';
        console.error('Upload error:', err);
      },
    });
  }
}
