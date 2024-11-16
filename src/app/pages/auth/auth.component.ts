import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn())
            this.authService.initGoogleSignIn();
        else this.router.navigateByUrl('/');
    }
}
