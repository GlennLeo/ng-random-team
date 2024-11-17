import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


declare global {
  interface Window { google: any; localStorage: any }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private googleClientId: string = import.meta.env.NG_APP_PUBLIC_GG_AUTH_CLIENT_ID;

  constructor(private router: Router) { }

  initGoogleSignIn(): void {
    if (typeof window === 'undefined') return;
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
    window.google.accounts.id.revoke(this.googleClientId, (response: any) => {
      localStorage.removeItem('access_token');
      this.router.navigateByUrl('/');
    });
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    const expirationDate = decodedToken.exp ? decodedToken.exp * 1000 : null;
    if (expirationDate && Date.now() >= expirationDate) {
      localStorage.removeItem('access_token')
      return false;
    }
    return true;
  }

  private handleCredentialResponse(response: any): void {
    console.log('Credential Response:', response);
    const jwtToken = response.credential;
    localStorage.setItem('access_token', jwtToken);
    this.router.navigateByUrl('/');
  }
}