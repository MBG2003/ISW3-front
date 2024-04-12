import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { CursoDTO } from 'src/app/modelo/curso-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { ProgramaGetDTO } from 'src/app/modelo/programa-get-dto';
import { CursoService } from 'src/app/servicios/curso.service';
import { ProgramaService } from 'src/app/servicios/programa.service';

@Component({
  selector: 'app-lista-curso',
  templateUrl: './lista-curso.component.html',
  styleUrls: ['./lista-curso.component.css'],
  providers: [MessageService]
})
export class ListaCursoComponent implements OnInit {

  cols!: Column[];
  exportColumns!: ExportColumn[];
  textoEliminar: string;
  esEdicion!: boolean;
  esEdicionGrupo!: boolean;
  esEdicionHorario!: boolean;
  idEdicionHorario!: number;
  cursos: CursoGetDTO[];
  curso: CursoDTO;
  grupoSelected: Grupo = {idGrupo: -1, nombre: '', cupos: 0, horario: []};
  diaSelected: number;
  horaInicio!: number;
  horaFin!: number;
  diaEdicion: number[];
  horaInicioEdicion: number[];
  horaFinEdicion: number[];
  cupos: number;
  grupos: Grupo[] = [
    { idGrupo: 1, nombre: '01-D', cupos: 0, horario: [] },
    { idGrupo: 2, nombre: '02-D', cupos: 0, horario: []},
    { idGrupo: 3, nombre: '03-D', cupos: 0, horario: [] },
    { idGrupo: 4, nombre: '01-N', cupos: 0, horario: [] },
    { idGrupo: 5, nombre: '02-N', cupos: 0, horario: [] }
  ];
  diasSemana: DiaSemana[] = [
    {idDia: 0, nombre: 'Lunes'},
    {idDia: 1, nombre: 'Martes'},
    {idDia: 2, nombre: 'Miércoles'},
    {idDia: 3, nombre: 'Jueves'},
    {idDia: 4, nombre: 'Viernes'},
    {idDia: 5, nombre: 'Sábado'}
  ]
  facultades: FacultadGetDTO[];
  programas: ProgramaGetDTO[];
  recursos: Recurso[] = [
    { idRecurso: 0, nombre: 'COMPUTADORA', checked: false },
    { idRecurso: 1, nombre: 'VIDEOBEAM', checked: false }
  ]

  constructor(private cursoServicio: CursoService, private facultadServicio: FacultadService, private programaServicio: ProgramaService, private messageService: MessageService, private fileSaverService: FileSaverService) {
    this.cursos = [];
    this.facultades = [];
    this.programas = [];
    this.textoEliminar = '';
    this.curso = new CursoDTO();
    this.diaSelected = -1;
    this.diaEdicion = [];
    this.horaInicioEdicion = [];
    this.horaFinEdicion = [];
    this.cupos = 0;
  }

  ngOnInit(): void {
    this.facultadServicio.listar().subscribe({
      next: data => {
        this.facultades = data.response;
      }
    });

    this.listar();

    this.cols = [
      { field: 'idCurso', header: 'Cod. Asignatura' },
      { field: 'nombre', header: 'Asignatura' },
      { field: 'grupos', header: 'Grupos' },
      { field: 'nivel', header: 'Nivel' },
      { field: 'horas', header: 'Horas' },
      { field: 'creditos', header: 'Créditos' },
      { field: 'idPrograma', header: 'Programa' },
      { field: 'pensum', header: 'Pensum' },
      { field: 'idFacultad', header: 'Facultad' },
      { field: 'idDocente', header: 'Docente' },
      { field: 'cupos', header: 'Cupos' },
      { field: 'recursos', header: 'Necesidades Audiovisuales' },
      { field: 'horario', header: 'Horario' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  public listar() {
    this.cursoServicio.listar().subscribe({
      next: data => {
        this.cursos = data.response;
      },
      error: error => {
        this.cursos = [];
      }
    });
  }

  listarProgramasPorFacultad(idFacultad: any) {
    if(idFacultad instanceof EventTarget) {
      idFacultad = (idFacultad as HTMLSelectElement).value;
    }
    this.programaServicio.listarPorFacultad(idFacultad).subscribe({
      next: data => {
        this.programas = data.response;
      },
      error: error => {
        this.programas = [];
        this.showInfo(error.error.message);
      }
    })
  }

  agregarCurso() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.curso.recursos.push(r.idRecurso);
      }
    });

    if (!Array.isArray(this.curso.grupos)) {
      this.curso.grupos = Array.from(this.curso.grupos);
    }

    this.curso.idPrograma = this.curso.idPrograma.split(',')[1];

    this.cursoServicio.agregar(this.curso).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.limpiarCampos();
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
    this.cursos = [];
    this.listar();
  }

  editarCurso() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.curso.recursos.push(r.idRecurso);
      }
    });

    this.curso.idPrograma = this.curso.idPrograma.split(',')[1];

    this.cursoServicio.actualizar(this.curso).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.limpiarCampos();
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
    this.cursos = [];
  }

  borrarCurso() {
    this.cursoServicio.eliminar(this.curso.idFacultad, this.curso.idPrograma, this.curso.idCurso).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  editar(curso: CursoGetDTO) {
    this.limpiarCampos();
    this.listarProgramasPorFacultad(curso.idFacultad);
    this.curso.idFacultad = curso.idFacultad;
    this.curso.idPrograma = curso.idFacultad + ',' + curso.idPrograma;
    this.curso.idCurso = curso.idCurso;
    this.curso.idDocente = curso.idDocente;
    this.curso.nombre = curso.nombre;
    this.curso.pensum = curso.pensum;
    this.curso.creditos = curso.creditos;
    this.curso.nivel = curso.nivel;
    this.curso.horas = curso.horas;
    curso.grupos.map(g => {
      let index = this.grupos.findIndex(g2 => g.idGrupo === g2.idGrupo);
      if (index !== -1) {
        const grupo = this.grupos[index];
        grupo.cupos = g.cupos;
        this.curso.grupos.push(grupo);
      }
    });

    this.recursos.map(r1 => {
      let recursoIndex = curso.recursos.findIndex(r2 => r1.nombre === r2);
      if (recursoIndex !== -1) {
        r1.checked = true;
      }
    });
    this.esEdicion = true;
  }

  cambiarTxtEliminar(curso: CursoGetDTO) {
    this.curso.idFacultad = curso.idFacultad;
    this.curso.idPrograma = curso.idPrograma;
    this.curso.idCurso = curso.idCurso;
    this.textoEliminar = curso.idCurso;
  }

  estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
  }

  limpiarCampos() {
    this.curso.idFacultad = "";
    this.curso.idPrograma = "";
    this.curso.idDocente = "";
    this.curso.idCurso = "";
    this.curso.nombre = "";
    this.curso.pensum = "";
    this.curso.creditos = 0;
    this.curso.nivel = 0;
    this.curso.horas = 0;
    this.curso.grupos = [];
    this.curso.recursos = [];
    this.recursos.map(r => r.checked = false);
  };

  agregarGrupo() {
    let grupo = this.grupos.find(g => g.idGrupo === this.grupoSelected.idGrupo);
    if (grupo !== undefined) {
      if (!this.curso.grupos.some(g => g.idGrupo === this.grupoSelected.idGrupo)) {
        this.curso.grupos.push({ idGrupo: grupo.idGrupo, nombre: grupo.nombre, cupos: this.cupos, horario: this.grupoSelected.horario })
        this.grupoSelected = {idGrupo: -1, nombre: '', cupos: 0, horario: []};
        this.cupos = 0;
      } else {
        this.showWarn('El grupo ya fue agregado');
      }
    } else {
      this.showError('Error al agregar el grupo');
    }

  }

  editarGrupo() {
    let index = this.curso.grupos.findIndex(g => g.idGrupo === this.grupoSelected.idGrupo);
    if (index !== -1) {
      let grupo = this.grupos.find(g => g.idGrupo === this.grupoSelected.idGrupo);
      if (grupo !== undefined) {
        this.curso.grupos[index].cupos = this.cupos;
        this.curso.grupos[index].horario = this.grupoSelected.horario;
        this.grupoSelected = {idGrupo: -1, nombre: '', cupos: 0, horario: []};
        this.cupos = 0;
        this.esEdicionGrupo = false;
      }
    }
  }

  seleccionGrupo(grupo: Grupo) {
    this.grupoSelected = {idGrupo: grupo.idGrupo, nombre: grupo.nombre, cupos: grupo.cupos, horario: grupo.horario};
    this.cupos = grupo.cupos;
    this.esEdicionGrupo = true;
  }

  changeGrupoSelected(idGrupo: string) {
    console.log('cambiando grupo...');
    let grupo = this.grupos.find(g => g.idGrupo === Number.parseInt(idGrupo));
    if(grupo !== undefined) {
      this.grupoSelected = grupo;
      console.log(this.grupoSelected)
    } else {
      this.showInfo('Debe seleccionar un grupo');
    }
  }

  public eliminarGrupo(grupo: Grupo) {
    this.curso.grupos = this.curso.grupos.filter(g => g.idGrupo !== grupo.idGrupo);
  }

  agregarHorario() {
    let idHorario = this.grupoSelected.horario.length;
    this.grupoSelected.horario.push({idHorario: idHorario, diaSemana: this.diaSelected, horaInicio: this.horaInicio, horaFin: this.horaFin});
    this.diaEdicion.push(this.diaSelected);
    this.horaInicioEdicion.push(this.horaInicio);
    this.horaFinEdicion.push(this.horaFin);
    this.diaSelected = -1;
    this.horaInicio = 0;
    this.horaFin = 0;
  }

  editarHorario(idHorario: number) {
    let index = this.grupoSelected.horario.findIndex(h => h.idHorario === idHorario);
    if (index !== -1) {
      let horario = this.grupoSelected.horario.find(h => h.idHorario === idHorario);
      if (horario !== undefined) {
        console.log(this.diaEdicion, this.horaInicioEdicion, this.horaFinEdicion);
        this.grupoSelected.horario[index] = { idHorario: horario.idHorario, diaSemana: this.diaEdicion[idHorario], horaInicio: this.horaInicioEdicion[idHorario], horaFin: this.horaFinEdicion[idHorario] };
        this.esEdicionHorario = false;
        console.log(this.grupoSelected.horario);
      }
    }
  }

  eliminarHorario(idHorario: number) {
    this.grupoSelected.horario = this.grupoSelected.horario.filter(h => h.idHorario !== idHorario);
    this.diaEdicion.splice(idHorario, 1);
    this.horaInicioEdicion.splice(idHorario, 1);
    this.horaFinEdicion.splice(idHorario, 1);
  }

  changeEsEdicionHorario(nuevoHorario: Horario) {
    console.log(nuevoHorario);
    this.idEdicionHorario = nuevoHorario.idHorario;
    this.esEdicionHorario = true;
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

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.cursos);
        doc.save('listado_cursos.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.cursos);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'listado_cursos');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    this.fileSaverService.save(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

interface Recurso {
  idRecurso: number;
  nombre: string;
  checked: boolean;
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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}