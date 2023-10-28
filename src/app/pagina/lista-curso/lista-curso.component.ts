import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import { CursoGetDTO } from 'src/app/modelo/curso-get-dto';
import { CursoDTO } from 'src/app/modelo/curso-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { ProgramaGetDTO } from 'src/app/modelo/programa-get-dto';
import { CursoService } from 'src/app/servicios/curso.service';

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
  cursos: CursoGetDTO[];
  curso: CursoDTO;
  facultades: FacultadGetDTO[];
  programas: ProgramaGetDTO[];
  recursos: Recurso[] = [
    { idRecurso: 0, nombre: 'COMPUTADORA', checked: false },
    { idRecurso: 1, nombre: 'VIDEOBEAM', checked: false }
  ]

  constructor(private cursoServicio:CursoService, private facultadServicio: FacultadService, private messageService: MessageService, private fileSaverService: FileSaverService) {
    this.cursos = [];
    this.facultades = [];
    this.programas = [];
    this.textoEliminar = "";
    this.curso = new CursoDTO();
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
      { field: 'grupo', header: 'Grupo' },
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
        this.showError(error.error.message);
      }
    });
  }

  public agregarCurso() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.curso.recursos.push(r.idRecurso);
      }
    });


    this.cursoServicio.agregar(this.curso).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
    this.cursos = [];
  }

  public editarCurso() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.curso.recursos.push(r.idRecurso);
      }
    });


    this.cursoServicio.actualizar(this.curso).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
    this.cursos = [];
  }

  public borrarCurso() {
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

  public editar(curso: CursoGetDTO) {
    this.recursos.map(r => r.checked = false);
    this.curso.idFacultad = curso.idFacultad;
    this.curso.idPrograma = curso.idPrograma;
    this.curso.idCurso = curso.idCurso;
    this.curso.idDocente = curso.idDocente;
    this.curso.nombre = curso.nombre;
    this.curso.descripcion = curso.descripcion;
    this.curso.pensum = curso.pensum;
    this.curso.creditos = curso.creditos;
    this.curso.nivel = curso.nivel;
    this.curso.horas = curso.horas;
    this.curso.cupos = curso.cupos;
    this.recursos.map(r1 => {
      let recursoIndex = curso.recursos.findIndex(r2 => r1.nombre === r2);
      if (recursoIndex !== -1) {
        r1.checked = true;
      }
    });
    this.esEdicion = true;
  }

  public eliminar(curso: CursoGetDTO) {
    this.curso.idFacultad = curso.idFacultad;
    this.curso.idPrograma = curso.idPrograma;
    this.curso.idCurso = curso.idCurso;
    this.textoEliminar = curso.idCurso;
  }

  public estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
  }

  public limpiarCampos() {
    this.curso.idFacultad = "";
    this.curso.idPrograma = "";
    this.curso.idDocente = "";
    this.curso.idCurso = "";
    this.curso.nombre = "";
    this.curso.descripcion = "";
    this.curso.pensum = "";
    this.curso.creditos = 0;
    this.curso.nivel = 0;
    this.curso.horas = 0;
    this.curso.cupos = 0;
    this.recursos.map(r => r.checked = false);
  };

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

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}