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

  private authURL = `http://${window.location.hostname}:8080/sesion`;
  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  public login(sesion: SesionDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/login`, sesion);
  }
}
