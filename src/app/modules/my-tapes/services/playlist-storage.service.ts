import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaylistModel } from './playlist.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistStorageService {
  playlists$: BehaviorSubject<PlaylistModel | null> =
    new BehaviorSubject<PlaylistModel | null>(null);
}
