import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { MejoraProblemaDTO } from '../modelo/mejora-problema-dto';

@Injectable({
  providedIn: 'root'
})
export class MejoraProblemaService {

  private mejoraProblemaURL = `http://${window.location.hostname}:8080/mejoraProblema`;

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.mejoraProblemaURL}/listar`, {headers: this.headers});
  }

  public agregar(solicitud:MejoraProblemaDTO) {
    return this.http.post<MensajeDTO>(`${this.mejoraProblemaURL}/crear`, solicitud, {headers: this.headers});
  }

  public actualizar(solicitud:MejoraProblemaDTO) {
    return this.http.put<MensajeDTO>(`${this.mejoraProblemaURL}/actualizar`, solicitud, {headers: this.headers});
  }

  public eliminar(idSolicitud:string) {
    return this.http.delete<MensajeDTO>(`${this.mejoraProblemaURL}/eliminar/${idSolicitud}`, {headers: this.headers});
  }
}
