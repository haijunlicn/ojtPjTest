import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Attachment } from './models/attachment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'http://localhost:8080/imageKit';

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.uploadUrl, formData);
  }

  uploadAttachment(file: File): Observable<Attachment> {

    console.log("inside upload attachment "); // so it does get here but 
    console.log("Uploading file size:", file.size / 1024 / 1024, "MB");
    
    const formData = new FormData();
    formData.append('file', file);

    const token = this.authService.getToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.uploadUrl}/upload`, formData, { headers }).pipe(
      map(res => {
        const result: Attachment = {
          fileUrl: res.fileUrl || res.url,
          fileName: res.fileName || file.name,
          fileType: file.type,
          fileSize: file.size,
          thumbnailUrl: res.thumbnailUrl || ''
        };
        console.log("Mapped attachment: ", result); // doesn't reach here
        return result;
      })
    );
  }

}
