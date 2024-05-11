import { Injectable, WritableSignal, signal } from '@angular/core';
import { User } from './login/login.component';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(protected http: HttpClient) {
    // this.getUsers({}).subscribe();
  }

  users: WritableSignal<User[]> = signal([]);

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/user/exists/${username}`);
  }

  createUser(user: User): Observable<User>{
    return this.http.post<User>('/api/user', user)
    .pipe(
      tap((res: User) => {
        this.users.update((users: User[]) => {
          return [res, ...users];
        });
      })
    )
  }

  checkData(user: User): Observable<User>{
    return this.http.get<User>(`/api/user/${user.username}`);
  }

  getUsers(query?: any): Observable<User[]>{
    return this.http.post<User[]>(`/api/users`, {query})
    .pipe(
      tap((res: User[]) =>{
        this.users.set(res.reverse());
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>('/api/user');
  }

  login(user: User): Observable<User> {
    return this.http.patch<User>('/api/user', user).pipe(
      tap((res: User) => {
        this.users.update((users: User[]) => {
          return users.map(u => {
            if (u.username === user.username) {
              return { ...u, isLoggedIn: true };
            }
            return u;
          });
        })
    }))
  }
}


