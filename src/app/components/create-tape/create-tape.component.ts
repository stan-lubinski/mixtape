import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-create-tape',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-tape.component.html',
  styleUrls: ['./create-tape.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTapeComponent {}
