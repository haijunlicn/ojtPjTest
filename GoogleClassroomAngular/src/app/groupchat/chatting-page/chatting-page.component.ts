import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { filter } from 'rxjs';
import type { Message } from '../../models/message';
import type { NewMessage } from '../../models/new-message';
import type { User } from '../../models/user';
import type { MessageSeenDTO } from '../../models/message-seen-dto';
import type { SeenNotificationDTO } from '../../models/seen-notification-dto';

import { AuthService } from '../../auth/auth.service';
import { MessageService } from '../../message.service';
import { UserService } from '../../user.service';
import { WebSocketService } from '../../websocket.service';
import { ActivatedRoute } from '@angular/router';
import { ImageKitService } from '../../image-kit.service';
import { FileUploadService } from '../../file-upload.service';

@Component({
  selector: 'app-chatting-page',
  standalone: false,
  templateUrl: './chatting-page.component.html',
  styleUrl: './chatting-page.component.css',
})
export class ChattingPageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() selectedGroup: any;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChildren('messageElem') messageElements!: QueryList<ElementRef>;

  groupId!: number;
  groupName = '';
  newMessage = '';
  messages: Message[] = [];
  memberCount!: number;
  selectedFiles: File[] = [];
  selectedFilePreviews: string[] = []

  typingUsers = new Set<string>();
  typingTimeouts = new Map<string, any>();
  typingTimeout: any;

  hoverTimeoutId: any;
  seenByVisibleForMsgId: number | null = null;

  currentUser: User | null = null;
  loggedInEmail = '';
  loggedInUsername = '';
  currentRole = '';

  private lastGroupId: number | null = null;
  private observer!: IntersectionObserver;

  private groupMessageSub?: any;
  private seenNotificationSub?: any;
  private typingStatusSub?: any;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
  ) { }

  // ───────────────────────────────────────
  // Lifecycle Hooks
  // ───────────────────────────────────────

  ngOnInit(): void {
    this.loggedInEmail = this.authService.getUserEmail();
    this.loggedInUsername = this.authService.getUserName();
    document.addEventListener('click', this.closeOptionsBox);

    this.userService.currentUser$
      .pipe(filter((user): user is User => user !== null))
      .subscribe(user => (this.currentUser = user));

    this.initSeenNotificationSub();

    console.log("selected group 1 : " + this.selectedGroup.id);


    if (this.selectedGroup && !this.lastGroupId) {
      this.initializeGroup(
        this.selectedGroup.id,
        this.selectedGroup.name,
        this.selectedGroup.memberCount,
        this.selectedGroup.role
      );
    }
  }

  ngAfterViewInit(): void {
    this.setupObserver();
    this.messageElements.changes.subscribe(() => this.observeAllMessages());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGroup'] && this.selectedGroup) {
      console.log("group changes!");
      console.log("current role : " + this.selectedGroup.role);

      const newGroupId = this.selectedGroup.id;
      if (newGroupId !== this.lastGroupId) {
        this.initializeGroup(newGroupId, this.selectedGroup.name, this.selectedGroup.memberCount, this.selectedGroup.role);
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
    this.observer?.disconnect();
    this.seenNotificationSub?.unsubscribe();
    document.removeEventListener('click', this.closeOptionsBox);
  }

  // ───────────────────────────────────────
  // Initialization & Cleanup
  // ───────────────────────────────────────

  private initializeGroup(groupId: number, groupName: string, memberCount: number, role: string): void {
    this.lastGroupId = groupId;
    this.groupId = groupId;
    this.groupName = groupName;
    this.memberCount = memberCount;
    this.currentRole = role;

    this.cleanupSubscriptions();
    this.loadMessages();

    this.groupMessageSub = this.webSocketService.subscribeToGroup(this.groupId, () => {
      this.loadMessages(); // Or just push msg to messages
      this.scheduleScrollAndObserve();
    });

    this.subscribeToTypingStatus();
  }

  private cleanupSubscriptions(): void {
    this.groupMessageSub?.unsubscribe();
    this.typingStatusSub?.unsubscribe();

    this.groupMessageSub = undefined;
    this.typingStatusSub = undefined;
  }

  private initSeenNotificationSub(): void {
    if (!this.seenNotificationSub) {
      this.seenNotificationSub = this.webSocketService.seenNotifications$.subscribe((notification) =>
        this.updateMessageSeenStatus(notification)
      );
    }
  }

  private subscribeToTypingStatus(): void {
    this.typingStatusSub = this.webSocketService.subscribeToTyping(this.groupId, (status) => {
      const { name, typing } = status;
      if (name === this.loggedInUsername) return;

      if (typing) {
        this.typingUsers.add(name);
        clearTimeout(this.typingTimeouts.get(name));
        const timeout = setTimeout(() => this.typingUsers.delete(name), 1000);
        this.typingTimeouts.set(name, timeout);
      } else {
        this.typingUsers.delete(name);
        clearTimeout(this.typingTimeouts.get(name));
      }
    });
  }

  // ───────────────────────────────────────
  // Message Sending & Typing
  // ───────────────────────────────────────

  // sendMessage(): void {
  //   if (!this.newMessage.trim()) return;

  //   clearTimeout(this.typingTimeouts.get(this.loggedInUsername));
  //   this.typingTimeouts.delete(this.loggedInUsername);

  //   const messagePayload: NewMessage = {
  //     groupId: this.groupId,
  //     content: this.newMessage,
  //     sender: { email: this.loggedInEmail },
  //     timestamp: new Date().toISOString(),
  //   };

  //   this.webSocketService.sendMessage(messagePayload);
  //   this.newMessage = '';
  // }

  sendMessage() {
    if (!this.newMessage.trim() && this.selectedFiles.length === 0) {
      return;
    }

    if (this.selectedFiles.length > 0) {
      // Upload files sequentially or in parallel
      const uploadObservables = this.selectedFiles.map(file =>
        this.fileUploadService.uploadAttachment(file)
      );

      // Use forkJoin to wait for all uploads to finish
      import('rxjs').then(rxjs => {
        rxjs.forkJoin(uploadObservables).subscribe({
          next: (attachments) => {
            const messagePayload = {
              groupId: this.groupId,
              content: this.newMessage.trim(),
              sender: { email: this.loggedInEmail },
              timestamp: new Date().toISOString(),
              attachments: attachments, // array of uploaded attachment metadata
            };
            console.log("Sending messagePayload: ", messagePayload);
            this.webSocketService.sendMessage(messagePayload);

            // Reset input states
            this.newMessage = '';
            this.selectedFiles = [];
          },
          error: (err) => {
            console.error('Attachment upload failed', err);
          }
        });
      });

    } else {
      const messagePayload = {
        groupId: this.groupId,
        sender: { email: this.loggedInEmail },
        timestamp: new Date().toISOString(),
        content: this.newMessage.trim(),
        attachments: [],
      };
      this.webSocketService.sendMessage(messagePayload);
      this.newMessage = '';
    }
  }

  onTyping(): void {
    this.webSocketService.sendTypingStatus({
      email: this.loggedInEmail,
      name: this.loggedInUsername,
      typing: true,
      groupId: this.groupId,
    });

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.webSocketService.sendTypingStatus({
        email: this.loggedInEmail,
        name: this.loggedInUsername,
        typing: false,
        groupId: this.groupId,
      });
    }, 1000);
  }

  // ───────────────────────────────────────
  // Loading and Display
  // ───────────────────────────────────────

  loadMessages(): void {
    this.messageService.getMessages(this.groupId).subscribe({
      next: (msgs) => {
        this.messages = msgs.map((msg) => ({
          ...msg,
          seenBy: msg.seenBy || [],
        }));
        this.scheduleScrollAndObserve();
        console.log(msgs);

      },
      error: (err) => console.error('Error loading messages:', err),
    });
  }

  scrollToBottom(): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }

  private scheduleScrollAndObserve(delay: number = 50): void {
    setTimeout(() => {
      this.scrollToBottom();
      this.observeAllMessages();
    }, delay);
  }

  // ───────────────────────────────────────
  // Message Seen Logic
  // ───────────────────────────────────────

  onMouseEnter(msgId: number): void {
    this.hoverTimeoutId = setTimeout(() => {
      this.seenByVisibleForMsgId = msgId;
    }, 2000);
  }

  onMouseLeave(): void {
    clearTimeout(this.hoverTimeoutId);
    this.seenByVisibleForMsgId = null;
  }

  markMessageAsSeen(messageId: number): void {
    const dto: MessageSeenDTO = {
      messageId,
      userEmail: this.loggedInEmail,
    };
    this.webSocketService.sendSeenNotification(dto);
  }

  private updateMessageSeenStatus(notification: SeenNotificationDTO): void {
    const msg = this.messages.find((m) => m.id === notification.messageId);
    if (msg && !msg.seenBy?.some((u) => u.userId === notification.userId)) {
      msg.seenBy = msg.seenBy || [];
      msg.seenBy.push({
        userId: notification.userId,
        userName: notification.userName,
        seenAt: new Date(),
      });
    }
  }

  formatSeenTime(isoDate: string | Date): string {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ───────────────────────────────────────
  // Intersection Observer
  // ───────────────────────────────────────

  private setupObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = this.messageElements
            .toArray()
            .findIndex((el) => el.nativeElement === entry.target);

          if (index !== -1) {
            const messageId = this.messages[index].id;
            this.markMessageAsSeen(messageId);
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });
  }

  private observeAllMessages(): void {
    if (!this.observer) this.setupObserver();
    this.messageElements.forEach((el) => this.observer.observe(el.nativeElement));
  }



  selectedMessageId: number | null = null;
  isOwnMessage: boolean = false;
  optionsBoxPosition = { top: 0, left: 0 };

  onRightClick(event: MouseEvent, msg: Message): void {
    event.preventDefault(); // ⛔ Stop default right-click menu

    this.selectedMessageId = msg.id;
    this.isOwnMessage = msg.sender.email === this.loggedInEmail;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    this.optionsBoxPosition = {
      top: rect.top + window.scrollY - 10,
      left: this.isOwnMessage
        ? rect.right - 150
        : rect.left
    };
  }

  closeOptionsBox = () => {
    this.selectedMessageId = null;
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    files.forEach(file => {
      this.selectedFiles.push(file);

      if (this.isImage(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFilePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-images, push a generic icon or empty string
        this.selectedFilePreviews.push('');
      }
    });

    input.value = '';
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.selectedFilePreviews.splice(index, 1);
  }


  isImage(fileType: string | undefined): boolean {
    if (!fileType) return false;
    return fileType.toLowerCase().startsWith('image');
  }



  // isImage(fileType: string | undefined): boolean {
  //   if (!fileType) return false;
  //   // const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  //   const imageTypes = ['image'];
  //   return imageTypes.includes(fileType.toLowerCase());
  // }

  // Optional: to open image in a new tab on click
  openImageInNewTab(url: string | undefined) {
    if (url) {
      window.open(url, '_blank');
    }
  }


}
