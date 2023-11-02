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

  private mejoraProblemaUrl = "http://localhost:8080/mejoraProblema";

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.mejoraProblemaUrl}/listar`, {headers: this.headers});
  }

  public agregar(solicitud:MejoraProblemaDTO) {
    return this.http.post<MensajeDTO>(`${this.mejoraProblemaUrl}/crear`, solicitud, {headers: this.headers});
  }

  public actualizar(solicitud:MejoraProblemaDTO) {
    return this.http.put<MensajeDTO>(`${this.mejoraProblemaUrl}/actualizar`, solicitud, {headers: this.headers});
  }

  public eliminar(idSolicitud:string) {
    return this.http.delete<MensajeDTO>(`${this.mejoraProblemaUrl}/eliminar/${idSolicitud}`, {headers: this.headers});
  }
}
