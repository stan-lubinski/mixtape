import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserModel } from '../models/user';

@Injectable({
  providedIn: 'root',
})

// TODO types
export class CurrentUserService {
  private http: HttpClient = inject(HttpClient);
  private _user!: UserModel | null;

  get user(): UserModel | null {
    return this._user;
  }

  set user(value: UserModel | null) {
    this._user = value;
  }

  // user$: BehaviorSubject<UserModel | null> =
  //   new BehaviorSubject<UserModel | null>(null);

  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>('me').pipe(
      tap((res) => {
        console.log(res);

        this.user = res;
      })
    );
  }
}
