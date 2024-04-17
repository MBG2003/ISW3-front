import { Component, OnInit } from '@angular/core';
import { error } from 'jquery';
import { Column } from 'jspdf-autotable';
import { FileSaverService } from 'ngx-filesaver';
import { MessageService } from 'primeng/api';
import { AulaCursoDTO } from 'src/app/modelo/aula-curso-dto';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { CursoService } from 'src/app/servicios/curso.service';

@Component({
  selector: 'app-asignar-horario',
  templateUrl: './asignar-horario.component.html',
  styleUrls: ['./asignar-horario.component.css'],
  providers: [MessageService]
})
export class AsignarHorarioComponent implements OnInit {

  cols!: Column[];
  aulas: AulaGetDTO[];
  cursos: CursoGetDTO[];
  aulaSelected!: AulaGetDTO;
  cursoSelected!: CursoGetDTO;

  asignacion: AulaCursoDTO;

  diasSemana: DiaSemana[] = [
    { idDia: 0, nombre: 'Lunes' },
    { idDia: 1, nombre: 'Martes' },
    { idDia: 2, nombre: 'Miércoles' },
    { idDia: 3, nombre: 'Jueves' },
    { idDia: 4, nombre: 'Viernes' },
    { idDia: 5, nombre: 'Sábado' }
  ]

  constructor(private aulaService: AulaService, private cursoService: CursoService, private messageService: MessageService) {
    this.aulas = [];
    this.cursos = [];
    this.asignacion = new AulaCursoDTO();
  }

  ngOnInit(): void {
    this.cursoService.listar().subscribe({
      next: data => {
        this.cursos = data.response
      }
    })
  }


  public estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
  }

  obtenerHorarioGrupo(grupo: Grupo) {
    let horario: string = '';

    for (let h of grupo.horario) {
      horario += this.diasSemana[h.diaSemana].nombre + ' ' + this.horaString(h.horaInicio) + ' - ' + this.horaString(h.horaFin) + ', ';
    }

    return horario.slice(0, -2);
  }

  horaString(hora: number) {
    if (hora > 12) {
      return (hora - 12) + ':00 PM';
    }
    return hora + ':00 AM';
  }

  changeCursoSelected(curso: CursoGetDTO, grupo: Grupo) {
    this.asignacion.idFacultadCurso = curso.idCurso;
    this.asignacion.idPrograma = curso.idPrograma;
    this.asignacion.idCurso = curso.idCurso;

    this.aulas = [];

    grupo.horario.forEach(h => {
      this.aulaService.listarPorHorario(h.diaSemana, h.horaInicio, h.horaFin).subscribe({
        next: data => {
          const aulasResponse: AulaGetDTO[] = data.response;
  
          aulasResponse.forEach(a => {
            this.aulas.push({ idFacultad: a.idFacultad, idAula: a.idAula, nombre: a.nombre, capacidad: a.capacidad, estado: a.estado, recursos: a.recursos });
          });
        },
        error: error => {
          this.showError(error.error.message);
        }
      });
    }) ;
  }

  changeAulaSelected(aula: any) {
    this.asignacion.idFacultadAula = aula.idFacultad;
    this.asignacion.idAula = aula.idAula;
  }

  asignarAula() {
    this.cursoService.asignarAula(this.asignacion).subscribe({
      next: data => {
        this.showSuccess(data.message);
      },
      error: error => {
        this.showError(error.error.message);
      }
    })
  }

  public getSeverity(status: string) {
    switch (status) {
      case 'FUNCIONANDO':
        return 'info';

      case 'MANTENIMIENTO':
        return 'warning';

      default: return 'danger';
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Correcto', detail: message });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}

interface Grupo {
  idGrupo: number;
  nombre: string;
  cupos: number;
  horario: Horario[];
}

interface Horario {
  idHorario: number;
  diaSemana: number;
  horaInicio: number;
  horaFin: number;
}

interface DiaSemana {
  idDia: number;
  nombre: string;
}