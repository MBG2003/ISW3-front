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

  private aulaUrl = "http://localhost:8080/aula";

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaUrl}/listar`, {headers: this.headers});
  }

  public listarPorFacultad(idFacultad:string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaUrl}/listarPorFacultad/${idFacultad}`, { headers: this.headers });
  }

  public listarHorarioPorAula(idFacultad:string, idAula:string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.aulaUrl}/listarHorario?idFacultad=${idFacultad}&idAula=${idAula}`, { headers: this.headers });
  }

  public agregar(aula:AulaDTO) {
    return this.http.post<MensajeDTO>(`${this.aulaUrl}/crear`, aula, {headers: this.headers});
  }

  public actualizar(aula:AulaDTO) {
    return this.http.put<MensajeDTO>(`${this.aulaUrl}/actualizar`, aula, {headers: this.headers});
  }

  public eliminar(idFacultad:string, idAula:string) {
    return this.http.delete<MensajeDTO>(`${this.aulaUrl}/eliminar?idFacultad=${idFacultad}&idAula=${idAula}`, {headers: this.headers});
  }
}
