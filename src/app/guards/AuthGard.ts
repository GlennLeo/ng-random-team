import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  constructor() {}

  async canActivate(): Promise<boolean> {
    document.body.classList.add('loading');
    const { data } = await this.supabase.checkSession();
    document.body.classList.remove('loading');

    if (!data.session) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}
