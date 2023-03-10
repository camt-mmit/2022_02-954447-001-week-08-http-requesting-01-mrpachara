import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'google-require-token',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './require-token.component.html',
  styleUrls: ['./require-token.component.scss'],
})
export class RequireTokenComponent {
  protected tokenReady$: Observable<boolean | null>;

  constructor(private readonly tokenService: TokenService) {
    this.tokenReady$ = this.tokenService.tokenReady$;
  }

  login(): void {
    this.tokenService
      .getAuthorizationLink()
      .pipe(take(1))
      .subscribe((url) => (location.href = url.toString()));
  }

  forecTokenExpired(): void {
    this.tokenService.forceExpired();
  }

  deleteToken(): void {
    this.tokenService.deleteToken();
  }
}
