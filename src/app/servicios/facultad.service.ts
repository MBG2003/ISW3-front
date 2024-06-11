import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})

export class FacultadService {

  private facultadURL = `http://${window.location.hostname}:8080/facultad`;

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.facultadURL}/listar`, { headers: this.headers });
  }
}
