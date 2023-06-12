import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PlaylistStorageService } from './playlist-storage.service';

export interface PlaylistModel {
  items: Array<{
    name: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private http = inject(HttpClient);
  private storage = inject(PlaylistStorageService);

  getCurrentUsersPlaylists(): Observable<PlaylistModel> {
    return this.http.get<PlaylistModel>('me/playlists').pipe(
      tap((res) => {
        this.storage.playlists$.next(res);
      })
    );
  }
}
