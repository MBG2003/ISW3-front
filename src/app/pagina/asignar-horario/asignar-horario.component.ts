import { Component } from '@angular/core';
import { Column } from 'jspdf-autotable';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';

@Component({
  selector: 'app-asignar-horario',
  templateUrl: './asignar-horario.component.html',
  styleUrls: ['./asignar-horario.component.css']
})
export class AsignarHorarioComponent {

  cols!: Column[];
  aulas: AulaGetDTO[];

  constructor() {
    this.aulas = [];
  }


  public estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
  }
}
