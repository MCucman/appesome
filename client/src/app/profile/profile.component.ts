import { Component} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Post } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { User } from '../login/login.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(protected postService: PostService, protected userService: UserService, protected router: Router){
    this.getFollowers();
    postService.getPosts().subscribe();
    if(!userService.currentUser)
      router.navigate(['/']);
  }

  protected followers: User[] = [];

  logout(){
    this.userService.clearCurrentUser();
    this.router.navigate(["/login"]);
  }

  getOtherUser(username: string){
    if(this.userService.currentUser){
      if(username != this.userService.currentUser.username)
        this.userService.getUser(username).subscribe((res: User) => {
          this.userService.setOtherUser(res);
        });
      else
        this.router.navigate(['/profile']);
    }
  }

  popup: {[key: string]: boolean} = {};

  togglePopup(post_id: string){
    if (this.popup[post_id])
      this.popup[post_id] = false;
    else
      this.popup[post_id] = true;
  }

  showPopup(post_id: string){
    return this.popup[post_id];
  }

  showFollowersPopup: boolean | null = null;
  showFollowingPopup: boolean | null = null;

  togglePopupF(type: string): void {
    if (type === 'fs') {
      this.showFollowersPopup = !this.showFollowersPopup;
      if (this.showFollowersPopup) {
        this.showFollowingPopup = false;
      }
    } else if (type === 'fing') {
      this.showFollowingPopup = !this.showFollowingPopup;
      if (this.showFollowingPopup) {
        this.showFollowersPopup = false;
      }
    }
  }

  showPopupF(type: string) {
    if (type === 'fs') {
      return this.showFollowersPopup;
    } else if (type === 'fing') {
      return this.showFollowingPopup;
    }
    return false;
  }

  getFollowers() {
    this.userService.getFollowers().subscribe(
      ((res: User[]) => {
        this.followers = res.reverse();
      })
    )
  }

  deletePost(post: Post){
    this.postService.deletePost(post).subscribe();
  }
}
