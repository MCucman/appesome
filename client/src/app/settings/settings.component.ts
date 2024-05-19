import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(""),
    username: new FormControl(""),
    description: new FormControl(""),
    currentPassword: new FormControl(""),
    newPassword: new FormControl(""),
    confirmPassword: new FormControl("")
  });

  constructor(protected userService: UserService, protected router: Router) {
    if(!userService.currentUser)
      router.navigate(['/']);
  }

  updateUser() {
    const user = this.form.value;
    const username = this.userService.currentUser!.username;

    if (user.newPassword && user.newPassword !== user.confirmPassword) {
      alert("Wrong confirm password");
      return;
    }

    delete user.confirmPassword;

    Object.keys(user).forEach(key => {
      if (user[key] === null || user[key] === undefined || user[key] === '') {
        delete user[key];
      }
    });

    this.userService.verifyPassword(username, user.currentPassword).subscribe({
      next: (isValid) => {
        if (!isValid) {
          alert("Current password is incorrect");
          return;
        }
        delete user.currentPassword;

        if (user.newPassword) {
          user.password = user.newPassword;
          delete user.newPassword;
        }
        if(user.username){
          this.userService.checkUsernameExists(user.username).subscribe({
            next: (exists) => {
              if (exists && user.username !== username) {
                alert("Username taken.");
                return;
              } else {
                const currentUser = { ...this.userService.currentUser, ...user };
                this.userService.setCurrentUser(currentUser);
                this.userService.updateUser(username, user).subscribe({
                  next: () => {
                    this.router.navigate(["/home"]);
                  },
                  error: (err) => {
                    console.error("Error updating user:", err);
                  }
                });
              }
            },
            error: (err) => {
              console.error("Error checking username:", err);
            }
          });
        }else{
          const currentUser = { ...this.userService.currentUser, ...user };
          this.userService.setCurrentUser(currentUser);
          this.userService.updateUser(username, user).subscribe({
            next: () => {
              this.router.navigate(["/home"]);
            },
            error: (err) => {
              console.error("Error updating user:", err);
            }
          });
        }

      },
      error: (err) => {
        console.error("Error verifying password:", err);
      }
    });
  }

  deleteAcc() {
    if(confirm('Are you sure you want to delete your account?')){
      this.userService.deleteAcc().subscribe({
        next: () => {
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
