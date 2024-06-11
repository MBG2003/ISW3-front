import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { Observable } from 'rxjs';
import { AulaDTO } from '../modelo/aula-dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private aulaURL = `http://${window.location.hostname}:8080/aula`;

  private headers!: HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public cargarAulas(aulasCSV: File): Observable<MensajeDTO> {
    const formData = new FormData();
    formData.append('file', aulasCSV);
    return this.http.post<MensajeDTO>(`${this.aulaURL}/cargarAulasCSV`, formData, { headers: this.headers });
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaURL}/listar`, { headers: this.headers });
  }

  public listarPorFacultad(idFacultad: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaURL}/listarPorFacultad/${idFacultad}`, { headers: this.headers });
  }

  public listarHorarioPorAula(idFacultad: string, idAula: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaURL}/listarHorarioPorAula?idFacultad=${idFacultad}&idAula=${idAula}`, { headers: this.headers });
  }

  public listarHorarios(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaURL}/listarHorarios`, { headers: this.headers });
  }

  public listarPorHorario(diaSemana: number, horaInicio: number, horaFin: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaURL}/listarPorHorario?diaSemana=${diaSemana}&horaInicio=${horaInicio}&horaFin=${horaFin}`, { headers: this.headers });
  }

  public agregar(aula: AulaDTO) {
    return this.http.post<MensajeDTO>(`${this.aulaURL}/crear`, aula, { headers: this.headers });
  }

  public actualizar(aula: AulaDTO) {
    return this.http.put<MensajeDTO>(`${this.aulaURL}/actualizar`, aula, { headers: this.headers });
  }

  public eliminar(idFacultad: string, idAula: string) {
    return this.http.delete<MensajeDTO>(`${this.aulaURL}/eliminar?idFacultad=${idFacultad}&idAula=${idAula}`, { headers: this.headers });
  }
}
