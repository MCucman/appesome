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
  users: WritableSignal<User[]> = signal([]);

  constructor(protected http: HttpClient, protected postService: PostService) {
    // this.getUsers({}).subscribe();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
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

  checkData(user: User): Observable<User>{
    return this.http.get<User>(`/api/user/${user.username}`);
  }

  getUsers(query?: any): Observable<User[]>{
    return this.http.post<User[]>(`/api/users`, {query}).pipe(
      tap((res: User[]) =>{
        this.users.set(res.reverse());
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


