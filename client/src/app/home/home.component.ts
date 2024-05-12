import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostService } from '../post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../login/login.component';

export interface Post {
  _id: string,
  title: string,
  content: string,
  likes: string[],
  created_at: Date,
  author: string
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  form: FormGroup = new FormGroup({
    title: new FormControl(""),
    content: new FormControl("")
  });

  constructor(protected postService: PostService, protected userService: UserService){}

  createPost() {
    const post: Post = this.form.value;
    if(post.title != null && post.title != "" && post.content != null && post.content != ""){
      const date = new Date();
      post.created_at = date;
      post.likes = [];
      if(this.userService.currentUser)
        post.author = this.userService.currentUser.username;
      this.postService.createPost(post).subscribe((res: any) => {
        this.form.reset();
      });
    }
  }

  addLike(post: Post, user: User) {
    if(this.userService.currentUser)
      this.postService.updatePost(post, user).subscribe();
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
}
