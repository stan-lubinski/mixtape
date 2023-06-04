import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mixtape';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log(environment.client_id);
  }

  redirectToAuth() {
    console.log(this.authService);
    this.authService.testFunc();
    // this.authService.redirectToAuthCodeFlow(environment.client_id);
  }

  getToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      this.authService.getAccessToken(environment.client_id, code).subscribe();
    }

    // res
    //     access_token
    // :
    // "BQDW3aLvDeAoKGluZe9Itn7JpYbC0xZmymsmRWHxSkZugcNvOajRh-0kTtXaQM6sq-LENisZb4saW-wjXCpEnUjGsrFk1PqrTONUcxJGHNUfA6p-OattBaddLSS7IlDtJgGVg2JcsVTJEAxw2tMVxtStjyRoNApF9gYbixs5bJjbX-3vvi-EHcPcKpigs0BW6cASBakV545RDw8wy-Cnvg"
    // expires_in
    // :
    // 3600
    // refresh_token
    // :
    // "AQAdNI4_wTLr2jf2WWAvib4FWqfy5vjgf28JFSyYTD_i5WoaVYdC8lc_goIJIyY8VPVUI6bedcdNBquzWeuFhaNkS6s06C5DshMkpSiEinz-Z_WOYWLlhdnLtVI-F3Bds5g"
    // scope
    // :
    // "user-read-email user-read-private"
    // token_type
    // :
    // "Bearer"
  }

  refreshToken() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      this.authService.refreshAccessToken(code).subscribe();
    }
  }
}
