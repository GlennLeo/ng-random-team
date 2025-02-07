import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  isAuthenticated = false;

  async ngOnInit(): Promise<void> {
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event); // Logs events like SIGNED_IN, SIGNED_OUT, etc.
      console.log('Session:', session); // Logs the session details
      if (session?.access_token) {
        this.isAuthenticated = true;
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }

  async signOut() {
    console.log('signout');
    await this.supabase.handleSignOut();
  }
}
