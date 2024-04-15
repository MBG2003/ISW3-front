import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SesionDTO } from '../modelo/sesion-dto';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = "http://localhost:8080/sesion";
  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  public login(sesion: SesionDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/login`, sesion);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('AuthToken'); // Reemplaza esto por tu forma de obtener el token

    try {
      if (token && !this.jwt.isTokenExpired(token)) {
        // El token es válido y no ha expirado
        return true;
      } else {
        // El token no es válido o ha expirado
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
