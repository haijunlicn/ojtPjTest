import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groupchat-list',
  standalone: false,
  templateUrl: './groupchat-list.component.html',
  styleUrl: './groupchat-list.component.css'
})
export class GroupchatListComponent {
  @Input() title!: string;
  @Input() groups: any[] = [];
  @Input() role!: string;
  @Input() selectedGroupId?: number | null = null;
  @Output() groupSelected = new EventEmitter<any>();

  constructor(private modalService: ModalService, private toastr: ToastrService) { }

  onGroupClick(group: any) {
    this.groupSelected.emit(group);
  }

  openCreateGroupModal() {
    console.log("create clicked");
    this.modalService.open('createGroup');
  }

  openJoinGroupModal() {
    this.modalService.open('joinGroup');
  }

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code).then(() => {

      this.toastr.success('Copied to clipboard!', '', {
        timeOut: 0,
        closeButton: true,
        progressBar: true
      }).onShown.subscribe(toast => {
        setTimeout(() => {
          this.toastr.clear();
        }, 2000); // Dismiss after 2 seconds
      });

    });
  }

}
