import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../modal.service';

import { GroupChatService } from '../../group-chat.service';
import { GroupChat } from '../../models/groupchat';


@Component({
  selector: 'app-create-group-box',
  templateUrl: './create-group-box.component.html',
  styleUrls: ['./create-group-box.component.css'],
  standalone: false
})
export class CreateGroupBoxComponent {
  @Output() groupCreated = new EventEmitter<void>();
  group: GroupChat = {
    name: '',
  };
  errorMessage: string = '';
  isOpen: boolean = false;

  constructor(private modalService: ModalService, private groupChatService: GroupChatService) { }

  ngDoCheck() {
    this.isOpen = this.modalService.isOpen('createGroup');
  }

  close() {
    this.modalService.close('createGroup');
  }

  onCreateGroup() {
    this.groupChatService.createGroup(this.group).subscribe({
      next: (response) => {
        console.log('Group created successfully:', response);
        this.groupCreated.emit(); 
        this.close();
      },
      error: (error) => {
        console.error('Error creating group:', error);
        this.errorMessage = error?.error?.message || 'An unexpected error occurred.';
      }
    });
  }

}
