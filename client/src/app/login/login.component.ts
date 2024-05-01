import { Component } from '@angular/core';
import { Router } from '@angular/router'
// import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(/*private authService: AuthService, */private router: Router) { }

  login() {
  //   const userData = { username: this.username, password: this.password };
  //   this.authService.loginUser(userData).subscribe(
  //     response => {
  //       localStorage.setItem('token', response.token);
  //       this.router.navigate(['/home']);
  //     },
  //     error => {
  //       console.error('Wrong credentials:', error);
  //       this.errorMessage = error.error.message || 'Wrong credentials.';
  //     }
  //   );
  }

  register() {
  //   const userData = { username: this.username, password: this.password };
  //   this.authService.registerUser(userData).subscribe(
  //     response => {
  //       localStorage.setItem('token', response.token);
  //       this.router.navigate(['/home']);
  //     },
  //     error => {
  //       console.error('Greška pri registraciji:', error);
  //       this.errorMessage = error.error.message || 'Greška pri registraciji.';
  //     }
  //   );
  }
}
