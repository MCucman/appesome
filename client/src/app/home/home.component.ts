import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostService } from '../post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService } from '../user.service';

export interface Post {
  _id: string,
  title: string,
  content: string,
  likes: number,
  created_at: Date
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
      post.likes = 0;
      post.created_at = date;
      this.postService.createPost(post).subscribe((res: any) => {
        this.form.reset();
      });
    }
  }

  addLike(post: Post) {
    this.postService.updatePost(post).subscribe();
  }
}
