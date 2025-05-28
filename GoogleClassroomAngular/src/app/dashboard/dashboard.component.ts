import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';
import { ModalService } from '../modal.service';
import { GroupChatService } from '../group-chat.service';
import { GroupChat } from '../models/groupchat';
import { UserService } from '../user.service';
import { filter } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userEmail: String | null = null;
  createdGroups: GroupChat[] = [];
  joinedGroups: GroupChat[] = [];
  currentUser: User | null = null;
  selectedGroup: any = null;
  sidebarOpen = false;

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private groupchatService: GroupChatService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  onGroupSelected(group: any) {
    this.selectedGroup = group;
    this.router.navigate(['/chatting-site/group', group.id]);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onBackgroundClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('v0-overlay')) {
      this.closeSidebar();
    }
  }

  openCreateGroupModal() {
    console.log("create clicked");
    this.modalService.open('createGroup');
  }

  openJoinGroupModal() {
    this.modalService.open('joinGroup');
  }

  ngOnInit(): void {


    this.route.paramMap.subscribe(params => {
      const groupId = params.get('groupId');
      if (groupId && this.currentUser) {
        this.setSelectedGroupFromId(+groupId);
      }
    });

    // Watch for current user load
    this.userService.currentUser$
      .pipe(filter((user): user is User => user !== null))
      .subscribe(user => {
        this.currentUser = user;
        this.reloadGroupchats('create');
        this.reloadGroupchats('join');
        const routeGroupId = this.route.snapshot.paramMap.get('groupId');
        if (routeGroupId) {
          this.setSelectedGroupFromId(+routeGroupId);
        }
      });
  }

  setSelectedGroupFromId(groupId: number): void {
    const groups = [...(this.currentUser?.createdGroups || []), ...(this.currentUser?.joinedGroups || [])];
    const found = groups.find(g => g.id === groupId);
    if (found) {
      this.selectedGroup = found;
    } else {
      console.warn('Group not found for ID:', groupId);
    }
  }


  reloadGroupchats(createOrJoin: string) {
    if (createOrJoin === 'create') {
      this.groupchatService.getCreatedGroups(this.currentUser!.id).subscribe({
        next: (data) => {
          this.currentUser!.createdGroups = data
          console.log("created groups : " + JSON.stringify(data, null, 2));

        },
        error: (err) => console.error('Error fetching created groups', err)
      });
    } else if (createOrJoin === 'join') {
      this.groupchatService.getJoinedGroups(this.currentUser!.id).subscribe({
        next: (data) => {
          this.currentUser!.joinedGroups = data
          console.log("joined groups : " + JSON.stringify(data, null, 2));
        },
        error: (err) => console.error('Error fetching joined groups', err)
      });
    }
  }

}
