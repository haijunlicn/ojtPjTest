import { Component } from '@angular/core';
import { LoginForm } from '../../models/login-form';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formData: LoginForm = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  loginUser(): void {
    this.authService.login(this.formData).subscribe({
      next: (res) => {
        this.authService.storeToken(res.token);

        this.userService.loadCurrentUser().subscribe({
          next: (user) => {
            console.log('Current user loaded:', user);
            this.router.navigate(['/chatting-site']);
          },
          error: (err) => {
            console.error('Failed to load user info', err);
          }
        });

      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}
