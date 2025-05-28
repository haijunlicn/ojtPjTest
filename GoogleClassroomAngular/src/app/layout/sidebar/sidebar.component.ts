import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {

  userEmail: String | null = null;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
  }

}
