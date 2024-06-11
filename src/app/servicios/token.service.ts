import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Buffer } from 'buffer';

const TOKEN_KEY = "AuthToken";
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private router: Router, private jwt: JwtHelperService) { }
  public setToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getUsername(): string {
    const token = this.getToken();
    if (token) {
      return this.decodePayload().name;
    }
    return '';
  }

  public getRole(): string[] {
    const token = this.getToken();
    if (token) {
      return this.decodePayload().authorities;
    }
    return [];
  }

  public isLogged(): boolean {
    const token = this.getToken();
    if (token && !this.jwt.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  public login(token: string) {
    this.setToken(token);
    this.router.navigate(["/gestion_aulas"]);
  }

  public logout() {
    window.localStorage.clear();
    this.router.navigate(["/gestion_aulas/login"]);
  }

  public decodePayload(): any {
    const payload = this.getToken()!.split(".")[1];
    const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
    const values = JSON.parse(payloadDecoded);
    return values;
  }
}