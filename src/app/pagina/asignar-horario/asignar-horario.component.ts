import { Component, OnInit } from '@angular/core';
import { error } from 'jquery';
import { Column } from 'jspdf-autotable';
import { FileSaverService } from 'ngx-filesaver';
import { MessageService } from 'primeng/api';
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
export class AsignarHorarioComponent implements OnInit{

  cols!: Column[];
  aulas: AulaGetDTO[];
  cursos: CursoGetDTO[];
  aulaSelected!: AulaGetDTO;
  cursoSelected!: CursoGetDTO;

  constructor(private aulaService: AulaService, private cursoService: CursoService, private messageService: MessageService) {
    this.aulas = [];
    this.cursos = [];
  }

  ngOnInit(): void {
      this.aulaService.listar().subscribe({
        next: data => {
          this.aulas = data.response
        }
      })

      this.cursoService.listar().subscribe({
        next: data => {
          this.cursos = data.response
        }
      })
  }


  public estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
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
