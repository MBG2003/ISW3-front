import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { MensajeDTO } from '../modelo/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  private programaURL = "http://localhost:8080/programa";

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.programaURL}/listar`, { headers: this.headers });
  }
}
