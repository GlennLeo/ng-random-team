import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  clientId =
    '171513568800-9qkpbfnf5ivcvdojd6bg5vq40fjd5os7.apps.googleusercontent.com';
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  constructor() {}

  async ngOnInit(): Promise<void> {
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event); // Logs events like SIGNED_IN, SIGNED_OUT, etc.
      console.log('Session:', session); // Logs the session details
      if (session?.access_token) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async handleSignInWithGoogle() {
    await this.supabase.handleSignInWithGoogle();
  }
  async handleSignout() {
    await this.supabase.handleSignOut();
  }
}
