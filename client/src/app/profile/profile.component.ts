import { Component, WritableSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Post } from '../home/home.component';
import { User } from '../login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(protected postService: PostService, protected userService: UserService){};
  posts: WritableSignal<Post[]> = signal([]);

  logout(user: User){
    // this.userService.logout(user).subscribe();
  }

  deletePost(post: Post){
    this.postService.deletePost(post).subscribe();
  }
}
