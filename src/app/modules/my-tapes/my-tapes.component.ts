import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { PlaylistStorageService } from './services/playlist-storage.service';
import { PlaylistModel, PlaylistService } from './services/playlist.service';

@Component({
  selector: 'app-my-tapes',
  templateUrl: './my-tapes.component.html',
  styleUrls: ['./my-tapes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTapesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  get playlists$(): BehaviorSubject<PlaylistModel | null> {
    return this.storage.playlists$;
  }

  constructor(
    private httpService: PlaylistService,
    private storage: PlaylistStorageService
  ) {}

  ngOnInit(): void {
    this.getPlaylists();
  }

  getPlaylists() {
    this.httpService
      .getCurrentUsersPlaylists()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
