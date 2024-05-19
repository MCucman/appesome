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

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user).pipe(
      tap((res: User) => {
        this.users.update((users: User[]) => {
          return [res, ...users];
        });
        this.setCurrentUser(res);
      })
    );
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`/api/user/${username}`);
  }

  getFollowers(): Observable<User[]> {
    return this.http.get<User[]>(`/api/user/followers/${this.currentUser?.username}`);
  }

  follow(): Observable<User> {
    return this.http.patch<User>(`/api/user/follows/${this.currentUser?.username}/${this.otherUser?.username}`, {}).pipe(
      tap((res: User) => {
        this.users.update((users: User[]) => {
          return users.map((user: User) => {
            if (this.currentUser?._id == user._id) {
              if (!user.following.includes(this.otherUser!.username)) {
                return { ...user, following: res.following };
              } else {
                const following = user.following.filter((f: string) => {
                  return f != this.otherUser!.username;
                });
                return { ...user, following: following };
              }
            }
            return user;
          })
        })
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

  verifyPassword(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`/api/user/verifyPassword`, { username, password });
  }

  updateUser(username: string, newData: User): Observable<User> {
    return this.http.patch<User>(`/api/user/${username}`, newData).pipe(
      tap((res: User) => {
        this.postService.updatePosts(username, res.username).subscribe();
        this.updateFollowers(username, res).subscribe();
      })
    );
  }

  updateFollowers(username: string, user: User): Observable<User> {
    return this.http.patch<User>(`/api/user/${username}`, user).pipe(
      tap(() => {
        this.users.update((users: User[]) => {
          for (let u of users) {
            if (u.following.indexOf(username) != -1) {
              u.following[u.following.indexOf(username)] = user.username;
            }
          }
          return users;
        })
      })
    );
  }

  deleteAcc(): Observable<User> {
    return this.http.delete<User>(`/api/user/${this.currentUser!.username}`).pipe(
      tap(() => {
        this.users.update((users: User[]) => {
          for (let u of users) {
            if (u.following.includes(this.currentUser!.username)) {
              u.following = u.following.filter((us: string) => us != this.currentUser!.username);
            }
          }
          return users;
        })
        this.postService.removeOnDeleteAcc(this.currentUser!);
        this.clearCurrentUser();
      })
    )
  }
}
