import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'google-authorization-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
})
export class AuthorizationPageComponent implements OnInit {
  protected errorMessage: string | null = null;

  constructor(
    private readonly tokenService: TokenService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    const code = queryParams['code'];
    const securityToken = new URLSearchParams(queryParams['state']).get(
      'security_token',
    );

    if (code && securityToken) {
      this.tokenService
        .exchangeCodeForToken(code, securityToken, queryParams['error'])
        .pipe(take(1))
        .subscribe({
          next: (stateData) => this.router.navigateByUrl(stateData.redirectUrl),
          error: (err) => {
            if (err.error?.error) {
              this.errorMessage = `${err.error.error}`;
            } else if (err instanceof Error) {
              this.errorMessage = err.message;
            } else {
              this.errorMessage = `${err}`;
            }
          },
        });
    }
  }
}
