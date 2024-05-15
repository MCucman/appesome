import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

export interface User {
  _id: string,
  username: string,
  email: string,
  password: string,
  description: string,
  following: string[]
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  form: FormGroup = new FormGroup({
    email: new FormControl(""),
    username: new FormControl(""),
    password: new FormControl(""),
  });

  form2: FormGroup = new FormGroup({
    email2: new FormControl(""),
    username2: new FormControl(""),
    password2: new FormControl("")
  });

  constructor(protected userService: UserService, protected router: Router) {}

  register(): void {
    const user = this.form.value;
    if(user.username && user.email && user.password){
      this.userService.checkUsernameExists(user.username).subscribe( {next:
        (exists => {
          if (exists) {
            alert('Username already exists');
            this.form.reset();
          } else {
            this.createUser();
          }
        }), error:
        (error => {
          console.error('Error checking username existence', error);
        })}
      );
    } else {
      this.form.reset();
    }
  }

  createUser() {
    const user = this.form.value;
    user.description = '';
    user.following = [];
    this.userService.createUser(user).subscribe({next:
      ((res: any) => {
        this.router.navigate(["/home"]);
      }),error:
      (err => {
        console.error(err);
      })
    })
  }

  login() {
    const user = this.form2.value;
    user.username = user.username2;
    user.email = user.email2;
    user.password = user.password2;
    delete user['username2'];
    delete user['email2'];
    delete user['password2'];
    this.userService.checkUsernameExists(user.username).subscribe( {next:
      (exists => {
        if (exists) {
          this.userService.getUser(user.username).subscribe({ next:
            ((res: User) => {
              if(user.email == res.email && user.password == res.password){
                this.userService.login(user).subscribe();
                this.router.navigate(["/home"]);
              } else {
                alert('invalid credentials');
              }
            })
          })
        }else{
          this.form2.reset();
          alert("user doesn't exist");
        }
      })
    }),({error: (err: any) => {
      console.error(err);
        }
      })
  }

}
