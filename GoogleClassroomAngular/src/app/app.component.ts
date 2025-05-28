import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'GoogleClassroomAngular';

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {

    if (this.authService.isTokenValid()) {
      this.userService.loadCurrentUser().subscribe({
        next: (user) => console.log('User loaded on app init:', user),
        error: (err) => console.error('Failed to load current user:', err)
      });
    } else {
      console.log('No token found. Skipping user load.');
    }
  }

}
