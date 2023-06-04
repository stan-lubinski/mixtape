import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTapesComponent } from './my-tapes.component';

const routes: Routes = [
  {
    path: '',
    component: MyTapesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTapesRoutingModule {}
