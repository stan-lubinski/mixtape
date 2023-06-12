import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);
  code = undefined;

  redirectToAuthCodeFlow() {
    const verifier: string = this.generateCodeIdentifier(128);
    this.generateCodeChallenge(verifier).then((challenge) => {
      localStorage.setItem('verifier', verifier);

      const body = new URLSearchParams();
      body.append('client_id', environment.client_id);
      body.append('response_type', 'code');
      body.append('redirect_uri', 'http://localhost:4200');
      body.append('scope', 'user-read-private user-read-email');
      body.append('code_challenge_method', 'S256');
      body.append('code_challenge', challenge);
      document.location = `https://accounts.spotify.com/authorize?${body.toString()}`;
    });
  }

  // async guardFunction() {
  //   const clientId = 'your_client_id';
  //   const body = new URLSearchParams(window.location.search);
  //   const code = body.get('code');

  //   if (!code) {
  //     this.redirectToAuthCodeFlow(clientId);
  //   } else {
  //     // const accessToken = await this.getAccessToken(clientId, code);
  //     // const profile = await this.fetchProfile(accessToken);
  //     // console.log(profile);
  //   }
  // }

  // TODO: type
  getAccessToken(code: string): Observable<any> {
    const verifier = localStorage.getItem('verifier');

    const body = new URLSearchParams();
    body.append('client_id', environment.client_id);
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', 'http://localhost:4200');
    body.append('code_verifier', verifier!);

    return this.http
      .post('https://accounts.spotify.com/api/token', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
      .pipe(
        tap((res: any) => {
          console.log(res);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('access_token', res.access_token);
          // const userSub: Subscription = this.usersService
          //   .getCurrentUser()
          //   .subscribe(() => userSub.unsubscribe());
        })
      );
  }

  refreshAccessToken() {
    console.log('refresh token');

    const refreshToken = localStorage.getItem('refresh_token');

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refreshToken!);
    body.append('client_id', environment.client_id);
    body.append('client_secret', '8a5a0e53a80d448a9ccdd78e8477689a');

    return this.http
      .post('https://accounts.spotify.com/api/token', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
      .pipe(
        tap((res: any) => {
          if (res.refresh_token) {
            localStorage.setItem('refresh_token', res.refresh_token);
          }
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private generateCodeIdentifier(length: number): string {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '-')
      .replace(/=+$/, '');
  }
}
