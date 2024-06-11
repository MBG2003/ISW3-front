import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../modelo/mensaje-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarioURL = `http://${window.location.hostname}:8080/usuario`;

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public consultarNombre(documento: String): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.usuarioURL}/consultaNombreUsuario/${documento}`, {headers: this.headers});
  }

}
