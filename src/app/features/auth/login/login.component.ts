import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from './../models/login-request.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model: LoginRequest;

  constructor(private authService: AuthService, private cookieService: CookieService,
    private router: Router) {
    this.model = {
      email: '',
      password: ''
    };
  }

  onFormSubmit(): void {
    this.authService.login(this.model)
    .subscribe({
      next: (response) => {
        //Set Auth cookie
        this.cookieService.set('Authorization', `Bearer ${response.token}`,
        undefined, '/', undefined, true, 'Strict');

        //Set user
        this.authService.setUser({
          email: response.email,
          roles: response.roles
        });

        //Redirect to home
        this.router.navigateByUrl('/');
      }
    });
  }
}
