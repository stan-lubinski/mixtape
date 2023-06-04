import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-tapes',
  templateUrl: './my-tapes.component.html',
  styleUrls: ['./my-tapes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTapesComponent {
  mockData = [
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
    {
      name: 'Playlist',
    },
  ];
}
