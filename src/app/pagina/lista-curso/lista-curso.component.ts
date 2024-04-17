import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { CursoDTO } from 'src/app/modelo/curso-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { ProgramaGetDTO } from 'src/app/modelo/programa-get-dto';
import { CursoService } from 'src/app/servicios/curso.service';
import { ProgramaService } from 'src/app/servicios/programa.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lista-curso',
  templateUrl: './lista-curso.component.html',
  styleUrls: ['./lista-curso.component.css'],
  providers: [MessageService]
})
export class ListaCursoComponent implements OnInit {

  @ViewChild('f') f!: NgForm;
  formEnviado = false;

  nombreArchivo!: string;

  cols!: Column[];
  exportColumns!: ExportColumn[];
  textoEliminar: string;
  esEdicion!: boolean;
  esEdicionGrupo!: boolean;
  esEdicionHorario!: boolean;
  idEdicionHorario!: number;
  cursos: CursoGetDTO[];
  curso: CursoDTO;
  grupoSelected!: number;
  diaSelected: number;
  horaInicio!: string;
  horaFin!: string;
  diaEdicion: number[];
  horaInicioEdicion: string[];
  horaFinEdicion: string[];
  horario: Horario[];
  cupos!: number;
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
    this.grupoSelected = -1;
    this.diaSelected = -1;
    this.diaEdicion = [];
    this.horaInicioEdicion = [];
    this.horaFinEdicion = [];
    this.horario = [];
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
        this.showError(error.error.message);
      }
    });
  }

  onAulasCSVChange(event: any) {
    if(event.target.files.length > 0){
      this.nombreArchivo = event.target.files[0].name;
    }
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
        $('#agregarEditar').modal('hide');
        this.formEnviado = false;
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
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
        $('#agregarEditar').modal('hide');
        this.formEnviado = false;
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
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
      let contIdHorario = 0;
      let index = this.grupos.findIndex(g2 => g.idGrupo === g2.idGrupo);
      if (index !== -1) {
        const grupo = this.grupos[index];
        grupo.cupos = g.cupos;
        grupo.horario = [];
        g.horario.forEach(h => {
          grupo.horario.push({idHorario: contIdHorario, diaSemana: h.diaSemana, horaInicio: h.horaInicio, horaFin: h.horaFin})
          contIdHorario++;
        });
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

  limpiarCamposGrupo() {
    this.grupoSelected = -1;
    this.cupos = 0;
    this.horario = [];
    this.diaEdicion = [];
    this.horaInicioEdicion = [];
    this.horaFinEdicion = [];
  }

  agregarGrupo() {
    let grupo = this.grupos.find(g => g.idGrupo == this.grupoSelected);
    if (grupo !== undefined) {
      if (!this.curso.grupos.some(g => g.idGrupo == this.grupoSelected)) {
        const horarioClone: Horario[] = [];
        this.horario.forEach(h => horarioClone.push({idHorario: h.idHorario, diaSemana: h.diaSemana, horaInicio: h.horaInicio, horaFin: h.horaFin}));
        this.curso.grupos.push({ idGrupo: grupo.idGrupo, nombre: grupo.nombre, cupos: this.cupos, horario: horarioClone })
        this.limpiarCamposGrupo();
      } else {
        this.showWarn('El grupo ya fue agregado');
      }
    } else {
      this.showError('Error al agregar el grupo');
    }

  }

  editarGrupo() {
    let index = this.curso.grupos.findIndex(g => g.idGrupo == this.grupoSelected);
    if (index !== -1) {
      let grupo = this.grupos.find(g => g.idGrupo == this.grupoSelected);
      if (grupo !== undefined) {
        this.curso.grupos[index].cupos = this.cupos;
        this.curso.grupos[index].horario = this.horario;
        this.limpiarCamposGrupo();
        this.esEdicionGrupo = false;
      }
    }
  }

  seleccionGrupo(grupo: Grupo) {
    this.grupoSelected = grupo.idGrupo;
    this.cupos = grupo.cupos;
    this.horario = [];
    this.diaEdicion = [];
    this.horaInicioEdicion = [];
    this.horaFinEdicion = [];
    console.log(grupo.horario);
    grupo.horario.forEach(h => {
      this.horario.push({idHorario: h.idHorario, diaSemana: h.diaSemana, horaInicio: h.horaInicio, horaFin: h.horaFin});
      this.diaEdicion.push(h.diaSemana);
      this.horaInicioEdicion.push((h.horaInicio < 10 ? '0' : '') + h.horaInicio + ':00');
      this.horaFinEdicion.push((h.horaFin < 10 ? '0' : '') + h.horaFin + ':00');
    });
    this.esEdicionGrupo = true;
  }

  cancelarEdicionGrupo() {
    this.limpiarCamposGrupo();
    this.esEdicionGrupo = false;
  }

  changeGrupoSelected(idGrupo: string) {
    let grupo = this.grupos.find(g => g.idGrupo === Number.parseInt(idGrupo));
    if(grupo !== undefined) {
      this.grupoSelected = grupo.idGrupo;
    } else {
      this.showInfo('Debe seleccionar un grupo');
    }
  }

  eliminarGrupo(grupo: Grupo) {
    this.curso.grupos = this.curso.grupos.filter(g => g.idGrupo !== grupo.idGrupo);
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

  agregarHorario() {
    let idHorario = this.horario.length;
    this.horario.push({idHorario: idHorario, diaSemana: this.diaSelected, horaInicio: Number.parseInt(this.horaInicio.split(":")[0]), horaFin: Number.parseInt(this.horaFin.split(":")[0])});
    this.diaEdicion.push(this.diaSelected);
    this.horaInicioEdicion.push(this.horaInicio);
    this.horaFinEdicion.push(this.horaFin);
    this.diaSelected = -1;
    this.horaInicio = '';
    this.horaFin = '';
  }

  editarHorario(idHorario: number) {
    let index = this.horario.findIndex(h => h.idHorario === idHorario);
    if (index !== -1) {
      let horario = this.horario.find(h => h.idHorario === idHorario);
      if (horario !== undefined) {
        console.log(this.diaEdicion, this.horaInicioEdicion, this.horaFinEdicion);
        this.horario[index] = { idHorario: horario.idHorario, diaSemana: this.diaEdicion[idHorario], horaInicio: Number.parseInt(this.horaInicioEdicion[idHorario].split(":")[0]), horaFin: Number.parseInt(this.horaFinEdicion[idHorario].split(":")[0]) };
        this.esEdicionHorario = false;
      }
    }
  }

  eliminarHorario(idHorario: number) {
    this.horario = this.horario.filter(h => h.idHorario !== idHorario);
    this.diaEdicion.splice(idHorario, 1);
    this.horaInicioEdicion.splice(idHorario, 1);
    this.horaFinEdicion.splice(idHorario, 1);
  }

  changeEsEdicionHorario(nuevoHorario: Horario) {
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