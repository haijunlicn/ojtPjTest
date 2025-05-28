import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from './models/message';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://localhost:8080/messages';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMessages(groupId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/group/${groupId}`);
  }

  sendMessage(groupId: number, content: string): Observable<Message> {

    const token = this.authService.getToken;
    console.log("hello here in msg service");


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Message>(
      `${this.baseUrl}/send`,
      { groupId, content },
      { headers, responseType: 'text' as 'json' }
    );
  }

  sendMessageOverWebSocket(stompClient: any, message: any) {
    stompClient.publish({
      destination: '/messages/chat.sendMessage',
      body: JSON.stringify(message)
    });
  }

}
