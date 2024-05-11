import { Injectable, WritableSignal, signal } from '@angular/core';
import { Post } from './home/home.component';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(protected http: HttpClient) {
    this.getPosts().subscribe();
  }

  posts: WritableSignal<Post[]> = signal([]);

  getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>("/api/posts")
      .pipe(
        tap((res: Post[]) =>{
          this.posts.set(res.reverse());
        })
      );
  }

  createPost(post: Post): Observable<Post>{
    return this.http.post<Post>("/api/post", post)
    .pipe(
      tap((res: Post) => {
        this.posts.update((posts: Post[]) => {
          return [res, ...posts];
        });
      })
    );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.patch<Post>(`/api/post/${post._id}`, post)
      .pipe(
        tap((res: Post) => {
          this.posts.update((posts: Post[]) => {
            return posts.map(p => {
              if (p._id === post._id) {
                return { ...p, likes: post.likes+1 };
              }
              return p;
            });
          });
        })
      );
  }

  deletePost(post: Post): Observable<Post>{
    return this.http.delete<Post>(`/api/post/${post._id}`)
    .pipe(
      tap((res: Post) => {
        this.posts.update((posts: Post[]) => {
          return posts.filter((post_: Post) => {
            return post_._id !== post._id;
          });
        })
      })
    )
  }
}
