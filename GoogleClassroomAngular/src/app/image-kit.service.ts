import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageKitService {
  // Your ImageKit public key and endpoint from dashboard
  private publicKey = 'public_mtRPTeDpCXMJ5IBdJofsB1glHKU=';
  private urlEndpoint = 'https://ik.imagekit.io/haijun';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    // ImageKit upload API endpoint
    const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', this.publicKey);
    formData.append('folder', '/chat-uploads'); // optional folder path

    return this.http.post(uploadUrl, formData);
  }
}
