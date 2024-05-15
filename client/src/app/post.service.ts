import { Injectable, WritableSignal, signal } from '@angular/core';
import { Post } from './home/home.component';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from './login/login.component';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(protected http: HttpClient) {
    this.getPosts().subscribe();
  }

  posts: WritableSignal<Post[]> = signal([]);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>("/api/post").pipe(
      tap((res: Post[]) =>{
        this.posts.set(res.reverse());
      })
    );
  }

  createPost(post: Post): Observable<Post>{
    return this.http.post<Post>("/api/post", post).pipe(
      tap((res: Post) => {
        this.posts.update((posts: Post[]) => {
          return [res, ...posts];
        });
      })
    );
  }

  updatePost(post: Post, user: User): Observable<Post> {
    return this.http.patch<Post>(`/api/post/${post._id}/${user.username}`, {post, user}).pipe(
      tap((res: Post) => {
        this.posts.update((posts: Post[]) => {
          return posts.map((p: Post) => {
            if(!post.likes.includes(user.username)){
              if (p._id === post._id) {
                post.likes.push(user.username);
                return { ...p, likes: post.likes };
              }
            } else {
              if (p._id === post._id) {
                const likes = post.likes.filter((u: string) => {
                  return u != user.username;
                })
              return { ...p, likes: likes };
              }
            }
            return p;
          })
        })
      })
    )
  }

  deletePost(post: Post): Observable<Post>{
    return this.http.delete<Post>(`/api/post/${post._id}`).pipe(
      tap((res: Post) => {
        this.posts.update((posts: Post[]) => {
          return posts.filter((post_: Post) => {
            return post_._id !== post._id;
          });
        })
      })
    )
  }

  removeOnDeleteAcc(user: User){
    this.posts.update((posts: Post[]) => {
      for(let post of posts){
        if(post.likes.includes(user.username))
          post.likes.filter((u: string) => { u != user.username });
        if(post.author == user.username)
          this.deletePost(post).subscribe();
      }
      return posts;
    })
  }

  updatePosts(oldUsername: string, newUsername: string): Observable<Post[]>{
    return this.getPosts().pipe(
      tap((res: Post[]) => {
        this.posts.update((posts: Post[]) => {
          for(let post of posts) {
            if(post.author == oldUsername)
              post.author = newUsername;
            if(post.likes.indexOf(oldUsername) != -1)
              post.likes[post.likes.indexOf(oldUsername)] = newUsername;
          }
          return posts;
        })
      })
    )
  }
}
