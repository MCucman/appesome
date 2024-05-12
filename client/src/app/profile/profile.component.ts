import { Component, WritableSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { Post } from '../home/home.component';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NgbModule, CommonModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(protected postService: PostService, protected userService: UserService, protected router: Router){};
  posts: WritableSignal<Post[]> = signal([]);

  logout(){
    this.router.navigate(["/login"]);
  }

  popup: {[key: string]: boolean} = {};

  togglePopup(post_id: string){
    if (this.popup[post_id]) {
      this.popup[post_id] = false;
    } else {
      this.popup[post_id] = true;
    }
  }

  showPopup(post_id: string){
    return this.popup[post_id];
  }

  deletePost(post: Post){
    this.postService.deletePost(post).subscribe();
  }
}
