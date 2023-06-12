import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user';

@Injectable({
  providedIn: 'root',
})

// TODO types
export class UsersService {
  private http = inject(HttpClient);
  private url = 'users';

  getUsersProfile(user_id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.url}/${user_id}`);
    // .pipe(
    //   tap((res) => {
    //     this.storage.user$.next(res);
    //     this.storage.user = res;
    //   })
    // );
  }

  getCurrentUsersPlaylists() {}
}
