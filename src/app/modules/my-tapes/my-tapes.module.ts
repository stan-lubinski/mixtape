import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyTapesRoutingModule } from './my-tapes-routing.module';
import { MyTapesComponent } from './my-tapes.component';

@NgModule({
  declarations: [MyTapesComponent],
  imports: [CommonModule, MyTapesRoutingModule],
})
export class MyTapesModule {}
