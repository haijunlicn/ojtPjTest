import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../modal.service';
import { GroupChatService } from '../../group-chat.service';
import { GroupChat } from '../../models/groupchat';


@Component({
  selector: 'app-join-group-box',
  templateUrl: './join-group-box.component.html',
  styleUrls: ['./join-group-box.component.css'],
  standalone: false
})
export class JoinGroupBoxComponent {
  @Output() groupJoined = new EventEmitter<void>();
  group: GroupChat = {
    name: '',
  };
  errorMessage: string = '';
  isOpen: boolean = false;

  constructor(private modalService: ModalService, private groupChatService: GroupChatService) { }

  ngDoCheck() {
    this.isOpen = this.modalService.isOpen('joinGroup');
  }

  close() {
    this.modalService.close('joinGroup');
  }

  onJoinGroup() {
    this.groupChatService.joinGroup(this.group).subscribe({
      next: (response) => {
        console.log('Group joined successfully:', response);
        this.groupJoined.emit();
        this.close();
      },
      error: (error) => {
        console.error('Error joining group:', error);
        // this.errorMessage = error?.error?.message || 'An unexpected error occurred.';

        try {
          // Handle if error.error is a JSON string
          const parsed = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
          this.errorMessage = parsed?.message || 'An unexpected error occurred.';
        } catch {
          // Fallback if parsing fails
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }

}
