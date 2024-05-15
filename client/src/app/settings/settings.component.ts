import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { User } from '../login/login.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(""),
    username: new FormControl(""),
    description: new FormControl(""),
    password: new FormControl(""),
    password2: new FormControl("")
  });

  constructor(protected userService: UserService, protected router: Router){}

  updateUser(){
    const user = this.form.value;
    let username = '';
    let password = '';
    if(this.userService.currentUser){
      username = this.userService.currentUser.username;
      password = this.userService.currentUser.password;
    }
    if(password !== user['password2']){
      alert('wrong password');
      delete user['password2'];
      return;
    }

    delete user['password2'];

    Object.keys(user).forEach(key => {
      if (user[key] === null || user[key] === undefined || user[key] === '') {
        delete user[key];
      }
    });

    this.userService.checkUsernameExists(user['username']).subscribe({ next:
      (exists => {
        if(exists && user['username'] != username){
          alert("Username taken.");
          return;
        } else {
          const currentUser = { ...this.userService.currentUser, ...user };
          this.userService.setCurrentUser(currentUser);
          this.userService.updateUser(username, user).subscribe();
          this.router.navigate(["/home"]);
        }
      })
    });

  }

  deleteAcc(){
    this.userService.deleteAcc().subscribe({next:
      ((res: any) => {
        this.router.navigate(["/login"]);
      }),error:
      (err => {
        console.error(err);
      })
    });
  }
}


