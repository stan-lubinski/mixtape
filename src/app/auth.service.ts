import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private clientId = 'e44bccb0ca284c28bc7c7590bd016e82';
  code = undefined;

  constructor() {}

  testFunc() {}

  redirectToAuthCodeFlow(clientId: string) {
    console.log(clientId);

    const verifier: string = this.generateCodeIdentifier(128);
    this.generateCodeChallenge(verifier).then((challenge) => {
      localStorage.setItem('verifier', verifier);

      const body = new URLSearchParams();
      body.append('client_id', clientId);
      body.append('response_type', 'code');
      body.append('redirect_uri', 'http://localhost:4200');
      body.append('scope', 'user-read-private user-read-email');
      body.append('code_challenge_method', 'S256');
      body.append('code_challenge', challenge);
      document.location = `https://accounts.spotify.com/authorize?${body.toString()}`;
    });
  }

  async guardFunction() {
    const clientId = 'your_client_id';
    const body = new URLSearchParams(window.location.search);
    const code = body.get('code');

    if (!code) {
      this.redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await this.getAccessToken(clientId, code);
      // const profile = await this.fetchProfile(accessToken);
      // console.log(profile);
    }
  }

  // TODO: type
  getAccessToken(clientId: string, code: string): Observable<any> {
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
        })
      );

    // const result = await fetch('https://accounts.spotify.com/api/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: body,
    // });

    // const { access_token } = await result.json();
    // return access_token;
  }

  refreshAccessToken(code: string) {
    const verifier = localStorage.getItem('verifier');
    const refreshToken = localStorage.getItem('refresh_token');

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refreshToken!);
    body.append('client_id', environment.client_id);
    // body.append('code', code);
    // body.append('redirect_uri', 'http://localhost:4200');
    // body.append('code_verifier', verifier!);

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
        })
      );
  }

  // create separate service for profile requests
  async fetchProfile(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      // headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  isAuthenticated(): boolean {
    // return true;
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
