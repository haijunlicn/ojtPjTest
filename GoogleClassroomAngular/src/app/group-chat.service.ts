import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { GroupChat } from './models/groupchat';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  private baseUrl = 'http://localhost:8080/groupchats';

  constructor(private http: HttpClient, private authServie: AuthService) { }

  createGroup(group: GroupChat): Observable<GroupChat> {
    return this.http.post<GroupChat>(`${this.baseUrl}/createGroupchat`, group, {
      responseType: 'text' as 'json'
    });
  }

  joinGroup(group: GroupChat): Observable<GroupChat> {
    return this.http.post<GroupChat>(`${this.baseUrl}/joinGroupchat`, group, {
      responseType: 'text' as 'json'
    });
  }

  getCreatedGroups(userId: number): Observable<GroupChat[]> {
    return this.http.get<GroupChat[]>(`${this.baseUrl}/createdGroupList`, {
      params: { userId: userId.toString() }
    });
  }

  getJoinedGroups(userId: number): Observable<GroupChat[]> {
    return this.http.get<GroupChat[]>(`${this.baseUrl}/joinedGroupList`, {
      params: { userId: userId.toString() }
    });
  }

}
