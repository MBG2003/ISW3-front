import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { ReservaDTO } from '../modelo/reserva-dto';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private aulaUrl = "http://localhost:8080/reserva";

  private headers!: HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaUrl}/listar`, { headers: this.headers });
  }

  public listarPorAula(idFacultad: string, idAula:string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaUrl}/listarPorAula?idFacultad=${idFacultad}&idAula=${idAula}`, { headers: this.headers });
  }

  public agregar(reserva: ReservaDTO) {
    return this.http.post<MensajeDTO>(`${this.aulaUrl}/crear`, reserva, { headers: this.headers });
  }

  public actualizar(reserva: ReservaDTO) {
    return this.http.put<MensajeDTO>(`${this.aulaUrl}/actualizar`, reserva, { headers: this.headers });
  }

  public eliminar(idReserva: string) {
    return this.http.delete<MensajeDTO>(`${this.aulaUrl}/eliminar/${idReserva}`, { headers: this.headers });
  }
}
