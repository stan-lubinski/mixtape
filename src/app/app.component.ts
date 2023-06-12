import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CurrentUserService } from './services/current-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  get user() {
    return this.currentUserService.user;
  }

  title = 'mixtape';

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.usersService.getCurrentUser().subscribe();
    if (this.isAuthenticated) {
      this.currentUserService
        .getCurrentUser()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
    this.router.events
      .pipe(filter((ev) => ev.type === 1))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const code = this.route.snapshot.queryParamMap.get('code');
        if (code && !this.authService.isAuthenticated()) {
          this.authService
            .getAccessToken(code)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });
  }

  redirectToAuth() {
    this.authService.redirectToAuthCodeFlow();
  }

  // getToken() {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');
  //   if (code) {
  //     this.authService.getAccessToken(code).subscribe();
  //   }
  // }

  // refreshToken() {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');
  //   if (code) {
  //     this.authService.refreshAccessToken().subscribe();
  //   }
  // }
}
