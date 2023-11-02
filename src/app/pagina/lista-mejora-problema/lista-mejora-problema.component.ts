import { Component, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { MessageService } from 'primeng/api';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { MejoraProblemaDTO } from 'src/app/modelo/mejora-problema-dto';
import { MejoraProblemaGetDTO } from 'src/app/modelo/mejora-problema-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { MejoraProblemaService } from 'src/app/servicios/mejora-problema.service';

@Component({
  selector: 'app-lista-mejora-problema',
  templateUrl: './lista-mejora-problema.component.html',
  styleUrls: ['./lista-mejora-problema.component.css'],
  providers: [MessageService]
})
export class ListaMejoraProblemaComponent implements OnInit {
  cols!: Column[];
  exportColumns!: ExportColumn[];
  textoEliminar: string;
  esEdicion!: boolean;
  solicitudes: MejoraProblemaGetDTO[];
  solicitud: MejoraProblemaDTO;
  facultades: FacultadGetDTO[];
  aulas: AulaGetDTO[];

  constructor(private mejoraProblemaServicio: MejoraProblemaService, private facultadServicio: FacultadService, private aulaServicio: AulaService, private messageService: MessageService, private fileSaverService: FileSaverService) {
    this.textoEliminar = "";
    this.solicitudes = [];
    this.facultades = [];
    this.aulas = [];
    this.solicitud = new MejoraProblemaDTO();
  }

  ngOnInit(): void {
    this.facultadServicio.listar().subscribe({
      next: data => {
        this.facultades = data.response;
      },
      error: error => {

      }
    });

    this.listar();

    this.cols = [
      { field: 'idSolicitud', header: 'Cod. Solicitud' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'idAula', header: 'Aula' },
      { field: 'idFacultad', header: 'Facultad' },
      { field: 'emisor', header: 'Emisor' },
      { field: 'estado', header: 'Estado' },
      { field: 'observaciones', header: 'Observaciones' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  public listarAulasPorFacultad(idFacultad: any) {
    if (idFacultad instanceof EventTarget) {
      idFacultad = (idFacultad as HTMLSelectElement).value;
    }
    this.aulaServicio.listarPorFacultad(idFacultad).subscribe({
      next: data => {
        this.aulas = data.response;
      },
      error: error => {
        this.aulas = [];
        this.showInfo(error.error.message);
      }
    })
  }

  public editar(solicitud: MejoraProblemaGetDTO) {
    this.listarAulasPorFacultad(solicitud.idFacultad);
    this.solicitud.idSolicitud = solicitud.idSolicitud;
    this.solicitud.idFacultad = solicitud.idFacultad;
    this.solicitud.idAula = solicitud.idFacultad + ',' + solicitud.idAula;
    this.solicitud.emisor = solicitud.emisor;
    this.solicitud.descripcion = solicitud.descripcion;
    this.solicitud.estado = solicitud.estado;
    this.solicitud.observaciones = solicitud.observaciones;
    this.esEdicion = true;
  }

  public eliminar(solicitud: MejoraProblemaGetDTO) {
    this.solicitud.idSolicitud = solicitud.idSolicitud;
    this.textoEliminar = "" + solicitud.idSolicitud;
  }

  public listar() {
    this.mejoraProblemaServicio.listar().subscribe({
      next: data => {
        this.solicitudes = data.response;
      },
      error: error => {
      }
    });
  }

  public agregarSolicitud() {
    this.solicitud.idAula = this.solicitud.idAula.split(',')[1];
    this.solicitud.observaciones = 'No aplica.';
    this.solicitud.estado = 'REVISION';
    this.mejoraProblemaServicio.agregar(this.solicitud).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.limpiarCampos();
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
    this.solicitudes = [];
  }

  public editarSolicitud() {
    this.solicitud.idAula = this.solicitud.idAula.split(',')[1];
    this.mejoraProblemaServicio.actualizar(this.solicitud).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.limpiarCampos();
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  public borrarSolicitud() {
    this.mejoraProblemaServicio.eliminar("" + this.solicitud.idSolicitud).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  public limpiarCampos() {
    this.solicitud.idFacultad = "";
    this.solicitud.idAula = "";
    this.solicitud.idSolicitud = 0;
    this.solicitud.descripcion = "";
    this.solicitud.emisor = "";
    this.solicitud.observaciones = "";
    this.solicitud.estado = "";
  };

  public getSeverity(status: string) {
    switch (status) {
      case 'RECHAZADO':
        return 'danger';

      case 'ACEPTADO':
        return 'success';

      case 'SOLUCIONADO':
        return 'info';

      case 'REVISION':
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

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.solicitudes);
        doc.save('listado_solicitudes.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.solicitudes);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'listado_solicitudes');
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