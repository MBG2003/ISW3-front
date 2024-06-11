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
      horario += this.formatHorario(h);
    }

    return horario.slice(0, -2);
  }

  formatHorario(horario: Horario): string {
    return this.diasSemana[horario.diaSemana].nombre + ' ' + this.horaString(horario.horaInicio) + ' - ' + this.horaString(horario.horaFin) + ', ';
  }

  horaString(hora: number) {
    if (hora > 12) {
      return (hora - 12) + ':00 PM';
    }
    return hora + ':00 AM';
  }

  changeCursoSelected(curso: CursoGetDTO, grupo: Grupo, horario: Horario) {
    this.asignacion.idFacultadCurso = curso.idFacultad;
    this.asignacion.idPrograma = curso.idPrograma;
    this.asignacion.idCurso = curso.idCurso;
    this.asignacion.idGrupo = grupo.idGrupo;
    this.asignacion.idHorario = horario.idHorario;
    this.asignacion.diaSemana = horario.diaSemana;
    this.asignacion.horaInicio = horario.horaInicio;
    this.asignacion.horaFin = horario.horaFin;

    this.aulas = [];

    this.aulaService.listarPorHorario(horario.diaSemana, horario.horaInicio, horario.horaFin).subscribe({
      next: data => {
        const aulasResponse: AulaGetDTO[] = data.response;

        aulasResponse.forEach(aula => {
          let index = this.aulas.findIndex(a => a.idFacultad == aula.idFacultad && a.idAula == aula.idAula);
          if (index == -1) {
            this.aulas = [...this.aulas, {
              idFacultad: aula.idFacultad,
              idAula: aula.idAula,
              nombre: aula.nombre,
              capacidad: aula.capacidad,
              estado: aula.estado,
              recursos: aula.recursos
            }];
          }
        });
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
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
    });
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
  idHorario: string;
  diaSemana: number;
  horaInicio: number;
  horaFin: number;
}

interface DiaSemana {
  idDia: number;
  nombre: string;
}