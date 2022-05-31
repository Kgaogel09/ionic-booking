import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  login = false;
  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {}

  onLogin() {
    this.authService.login();
    setTimeout(() => {}, 2000);
    this.route.navigateByUrl('/places/tabs/discover');
  }
}
