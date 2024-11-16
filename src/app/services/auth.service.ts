import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare global {
  interface Window { google: any; }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private googleClientId: string = import.meta.env.NG_APP_PUBLIC_GG_AUTH_CLIENT_ID;

  constructor(private router : Router) { }

  initGoogleSignIn(): void {
    window.google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: this.handleCredentialResponse.bind(this)
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'), 
      { theme: 'outline', size: 'large' }  
    );
  }

  logout(): void {
    window.google.accounts.id.revoke(this.googleClientId, (response : any) => {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/');
    });
  }

  isLoggedIn() : boolean {
    return !!localStorage.getItem('access_token');
  }

  private handleCredentialResponse(response: any): void {
    console.log('Credential Response:', response);
    const jwtToken = response.credential;
    localStorage.setItem('access_token', jwtToken);
    this.router.navigateByUrl('/');
  }
}