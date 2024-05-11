import { Component, WritableSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Post } from '../home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(protected postService: PostService, protected userService: UserService, protected router: Router){};
  posts: WritableSignal<Post[]> = signal([]);

  logout(){
    this.router.navigate(["/login"]);
  }

  deletePost(post: Post){
    this.postService.deletePost(post).subscribe();
  }
}
