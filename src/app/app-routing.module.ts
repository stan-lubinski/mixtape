import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: 'my-tapes',
    loadChildren: () =>
      import('./modules/my-tapes/my-tapes.module').then((m) => m.MyTapesModule),
    canActivate: [
      () => {
        return AuthService.prototype.isAuthenticated();
      },
    ],
    // resolve: { user: currentUserResolver },
  },
  {
    path: 'create-tape',
    loadComponent: () =>
      import('./components/create-tape/create-tape.component').then(
        (m) => m.CreateTapeComponent
      ),
    // canActivate: [
    //   () => {
    //     return AuthService.prototype.isAuthenticated();
    //   },
    // ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
