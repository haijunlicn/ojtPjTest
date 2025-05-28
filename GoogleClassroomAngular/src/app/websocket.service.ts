import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { MessageSeenDTO } from './models/message-seen-dto';
import { Subject, Subscription } from 'rxjs';
import { SeenNotificationDTO } from './models/seen-notification-dto';
import { AuthService } from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client;
  private connected: boolean = false;
  private subscriptionCallbacks = new Map<string, (msg: any) => void>();
  private seenSubject = new Subject<SeenNotificationDTO>();
  public seenNotifications$ = this.seenSubject.asObservable();

  constructor(private authService: AuthService) {
    const token = this.authService.getToken();

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws-chat?token=${token}`),
      // webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      // connectHeaders: {
      //   Authorization: `Bearer ${token}`  // ✅ Send JWT properly
      // },
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('WebSocket connected');
        this.connected = true;

        // Subscribe to user-defined topics
        this.subscriptionCallbacks.forEach((callback, topic) => {
          this.stompClient.subscribe(topic, (message: IMessage) => {
            callback(JSON.parse(message.body));
          });
        });

        // Subscribe to seen notifications for all groups
        this.stompClient.subscribe('/topic/group/+', (message: IMessage) => {
          const seen: SeenNotificationDTO = JSON.parse(message.body);
          this.seenSubject.next(seen);
        });
      },
      onStompError: (frame) => {
        console.error('Broker error: ' + frame.headers['message']);
        console.error('Details: ' + frame.body);
      },
    });

    this.stompClient.activate();
  }


  subscribeToGroup(groupId: number, messageCallback: (msg: any) => void): Subscription | void {
    const topic = `/topic/group/${groupId}`;
    const seenTopic = `/topic/seen/${groupId}`;

    if (this.connected) {
      const msgSub = this.stompClient.subscribe(topic, (message: IMessage) => {
        messageCallback(JSON.parse(message.body));
      });

      const seenSub = this.stompClient.subscribe(seenTopic, (message: IMessage) => {
        const seen: SeenNotificationDTO = JSON.parse(message.body);
        this.seenSubject.next(seen);
      });

      // 👇 Combine them into a single subscription for easy management
      return new Subscription(() => {
        msgSub.unsubscribe();
        seenSub.unsubscribe();
      });
    } else {
      // For when connection is pending
      this.subscriptionCallbacks.set(topic, messageCallback);
      this.subscriptionCallbacks.set(seenTopic, (message: any) => {
        const seen: SeenNotificationDTO = message;
        this.seenSubject.next(seen);
      });
      return; // no subscription to return
    }
  }

  sendMessage(messagePayload: any) {
    if (this.connected) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(messagePayload)
      });
    } else {
      console.error('STOMP client not connected yet.');
    }
  }

  /** Send typing status */
  sendTypingStatus(payload: { email: string; name: string; typing: boolean; groupId: number }) {
    if (this.connected) {
      console.log("typing payload : " + payload);

      this.stompClient.publish({
        destination: '/app/typing',
        body: JSON.stringify(payload)
      });
    }
  }

  /** Subscribe to typing updates */
  subscribeToTyping(groupId: number, callback: (status: { name: string; typing: boolean }) => void) {
    const topic = `/topic/typing/${groupId}`;
    if (this.connected) {
      console.log("websocket service line 75");

      this.stompClient.subscribe(topic, (message: IMessage) => {
        callback(JSON.parse(message.body));
      });
    } else {
      this.subscriptionCallbacks.set(topic, callback);
    }
  }

  sendSeenNotification(dto: MessageSeenDTO): void {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: '/app/message/seen',
        body: JSON.stringify(dto)
      });
    }
  }

}
