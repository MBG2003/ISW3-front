import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { MensajeDTO } from '../modelo/mensaje-dto';
import { CursoDTO } from '../modelo/curso-dto';
import { AulaCursoDTO } from '../modelo/aula-curso-dto';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private cursoURL = `http://${window.location.hostname}:8080/curso`;

  private headers!:HttpHeaders;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    if (tokenService.isLogged()) {
      this.headers = new HttpHeaders({
        'Authorization': `${tokenService.getToken()}`
      });
    }
  }

  public listar(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.cursoURL}/listar`, {headers: this.headers});
  }

  public agregar(curso:CursoDTO) {
    return this.http.post<MensajeDTO>(`${this.cursoURL}/crear`, curso, {headers: this.headers});
  }

  public actualizar(curso:CursoDTO) {
    return this.http.put<MensajeDTO>(`${this.cursoURL}/actualizar`, curso, {headers: this.headers});
  }

  public eliminar(idFacultad:string, idPrograma:string, idCurso:string) {
    return this.http.delete<MensajeDTO>(`${this.cursoURL}/eliminar?idFacultad=${idFacultad}&idPrograma=${idPrograma}&idCurso=${idCurso}`, {headers: this.headers});
  }

  public asignarAula(aulaCursoDTO:AulaCursoDTO) {
    return this.http.post<MensajeDTO>(`${this.cursoURL}/asignarAula`, aulaCursoDTO, {headers: this.headers});
  }
}
