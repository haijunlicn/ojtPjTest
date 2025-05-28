import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user.service';
import { filter } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-sidebar2',
  standalone: false,
  templateUrl: './sidebar2.component.html',
  styleUrls: ['./sidebar2.component.css']  // ✅ FIXED: use styleUrls
})

export class Sidebar2Component {
  @Input() sidebarOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  currentUser: User | null = null;

  constructor(private authService: AuthService, private userService: UserService) {
    this.userService.currentUser$
      .pipe(filter((user): user is User => user !== null))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  onOverlayClick(event: Event) {
    event.stopPropagation();
    this.closeSidebar.emit();
  }

  logoutUser() {
    this.authService.logout();
  }

}
