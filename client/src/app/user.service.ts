import { Injectable, WritableSignal, signal } from '@angular/core';
import { User } from './login/login.component';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PostService } from './post.service';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  public currentUser: User | null = null;
  public otherUser: User | null = null;
  users: WritableSignal<User[]> = signal([]);

  constructor(protected http: HttpClient, protected postService: PostService) {
    const cUser = localStorage.getItem('currentUser');
    if (cUser) {
      this.currentUser = JSON.parse(cUser);
    }
    const oUser = localStorage.getItem('otherUser');
    if (oUser) {
      this.otherUser = JSON.parse(oUser);
    }
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  setOtherUser(user: User) {
    this.otherUser = user;
    localStorage.setItem('otherUser', JSON.stringify(user));
  }

  clearOtherUser() {
    this.otherUser = null;
    localStorage.removeItem('otherUser');
  }

  checkUsernameExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/user/exists/${id}`);
  }

  createUser(user: User): Observable<User>{
    return this.http.post<User>('/api/user', user).pipe(
      tap((res: User) => {
        this.users.update((users: User[]) => {
          return [res, ...users];
        });
        this.setCurrentUser(res);
      })
    )
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`/api/user/${username}`);
  }

  getFollowers(): Observable<User[]>{
    return this.http.get<User[]>(`/api/users/${this.currentUser?.username}`);
  }

  follow(): Observable<User> {
    return this.http.patch<User>(`/api/user/follows/${this.currentUser?.username}/${this.otherUser?.username}`, this.currentUser).pipe(
      tap((res: User) => {
        console.log(res);
      })
    );
  }

  login(user: User): Observable<User> {
    return this.http.get<User>(`/api/user/${user.username}`).pipe(
      tap((res: User) => {
        this.setCurrentUser(res);
      })
   );
  }

  updateUser(username: string, newData: User): Observable<User>{
    return this.http.patch<User>(`/api/user/${username}`, newData).pipe(
      tap((res: any) => {
        this.postService.updatePosts(username, res.username).subscribe();
      })
    );
  }

  deleteAcc(user: User): Observable<User>{
    return this.http.delete<User>(`/api/user/${user.username}`).pipe(
      tap((res: User) => {
        this.clearCurrentUser();
      })
    )
  }
}


