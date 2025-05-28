import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterForm } from '../../models/register-form';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formData: RegisterForm = {
    name: '',
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(private authService:AuthService, private router:Router){}

  registerUser():void{
    this.authService.register(this.formData).subscribe({
      next:(data) =>{
        console.log(data);
        this.router.navigate(['/auth/login']);
      },
      error:(err) => {
        console.log("error" + err);
        this.errorMessage = err.error?.message || 'Register failed';
      }
    })
  }

}
