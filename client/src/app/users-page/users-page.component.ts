import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Post } from '../home/home.component';
import { User } from '../login/login.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  constructor(protected postService: PostService, protected userService: UserService, protected router: Router){}

  updateLike(post: Post, user: User) {
    this.postService.updatePost(post, user).subscribe();
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

  getOtherUser(username: string){
    if(username != this.userService.currentUser?.username)
      this.userService.getUser(username).subscribe((res: User) => {
        this.userService.setOtherUser(res);
      });
    else
      this.router.navigate(['/profile']);
  }

  follow(){
    this.userService.follow().subscribe();
  }
}
