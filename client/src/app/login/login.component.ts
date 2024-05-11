import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

export interface User {
  username: string,
  email: string,
  password: string,
  description: string,
  isLoggedIn: boolean,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ],
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

  public curentUser = '';

  constructor(protected userService: UserService, protected router: Router) {}
  register(): void {
    const user = this.form.value;
    this.userService.checkUsernameExists(user.username).subscribe( {next:
      (exists => {
        if (exists) {
          console.log('Username already exists');
        } else {
          this.createUser();
        }
      }), error:
      (error => {
        console.error('Error checking username existence', error);
      })}
    );
  }

  createUser() {
    const user = this.form.value;
    user.isLoggedIn = true;
    this.userService.createUser(user).subscribe({next:
      ((res: any) => {
        console.log(res);
        this.curentUser = res.username;
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
    this.userService.checkData(user).subscribe({ next:
      ((res: any) => {
        if(user.email == res.email && user.password == res.password){
          this.userService.login(user).subscribe();
          this.createUser = res.username;
          this.router.navigate(["/home"]);
        }else{
          this.form2.reset();
          console.log('invalid credentials');
        }
      }), error: ((err: any) => {
        console.error(err);
      })
    })
  }

}
