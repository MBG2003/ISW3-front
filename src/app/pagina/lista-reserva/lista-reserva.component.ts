import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { MessageService } from 'primeng/api';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { ReservaDTO } from 'src/app/modelo/reserva-dto';
import { ReservaGetDTO } from 'src/app/modelo/reserva-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { ReservaService } from 'src/app/servicios/reserva.service';

@Component({
  selector: 'app-lista-reserva',
  templateUrl: './lista-reserva.component.html',
  styleUrls: ['./lista-reserva.component.css'],
  providers: [MessageService]
})
export class ListaReservaComponent implements OnInit {

  @ViewChild('cerrarForm') cerrarForm!: ElementRef

  @ViewChild('f') f!: NgForm;
  formEnviado = false;

  cols!: Column[];
  exportColumns!: ExportColumn[];
  textoEliminar: string;
  esEdicion!: boolean;
  horaInicio!: string;
  horaFin!: string;
  reservas: ReservaGetDTO[];
  reserva: ReservaDTO;
  facultades: FacultadGetDTO[];
  aulas: AulaGetDTO[];

  constructor(private reservaServicio: ReservaService, private facultadServicio: FacultadService, private aulaServicio: AulaService, private messageService: MessageService, private fileSaverService: FileSaverService) {
    this.textoEliminar = "";
    this.reservas = [];
    this.facultades = [];
    this.aulas = [];
    this.reserva = new ReservaDTO();
  }

  ngOnInit(): void {
    this.facultadServicio.listar().subscribe({
      next: data => {
        this.facultades = data.response;
      },
      error: error => {
        this.facultades = [];
      }
    });

    this.listar();

    this.cols = [
      { field: 'idReserva', header: 'Cod. Reserva' },
      { field: 'asunto', header: 'Asunto' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'idAula', header: 'Aula' },
      { field: 'idFacultad', header: 'Facultad' },
      { field: 'emisor', header: 'Emisor' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'horaInicio', header: 'Hora Inicio' },
      { field: 'horaFin', header: 'Hora Fin' },
      { field: 'estado', header: 'Estado' },
      { field: 'observaciones', header: 'Observaciones' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  listarAulasPorFacultad(idFacultad: any) {
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

  public editar(reserva: ReservaGetDTO) {
    this.listarAulasPorFacultad(reserva.idFacultad);
    this.reserva.idReserva = reserva.idReserva;
    this.reserva.idFacultad = reserva.idFacultad;
    this.reserva.idAula = reserva.idAula;
    this.reserva.emisor = reserva.emisor;
    this.reserva.asunto = reserva.asunto;
    this.reserva.descripcion = reserva.descripcion;
    this.reserva.estado = reserva.estado;
    this.reserva.fecha = reserva.fecha;
    this.reserva.horaInicio = reserva.horaInicio < 10 ? '0' : '' + reserva.horaInicio + ':00';
    this.reserva.horaFin = reserva.horaFin < 10 ? '0' : '' + reserva.horaFin + ':00';
    this.reserva.observaciones = reserva.observaciones;
    this.horaInicio = this.horaString(reserva.horaInicio);
    this.horaFin = this.horaString(reserva.horaFin);
    this.esEdicion = true;
  }

  public eliminar(reserva: ReservaGetDTO) {
    this.reserva.idReserva = reserva.idReserva;
    this.textoEliminar = "" + reserva.idReserva;
  }

  public listar() {
    this.reservas = [];
    this.reservaServicio.listar().subscribe({
      next: data => {
        data.response.forEach((r: ReservaGetDTO) => {
          this.reservas = [...this.reservas, {
            idReserva: r.idReserva,
            idFacultad: r.idFacultad,
            idAula: r.idAula,
            emisor: r.emisor,
            asunto: r.asunto,
            descripcion: r.descripcion,
            estado: r.estado,
            fecha: r.fecha,
            horaInicio: r.horaInicio,
            horaFin: r.horaFin,
            observaciones: r.observaciones
          }]
        })
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  public horaString(hora: number) {
    if (hora > 12) {
      return (hora - 12) + ':00 PM';
    }
    return hora + ':00 AM';
  }

  onChangeHoraInicio(event: string) {
    this.horaInicio = event;
  }

  onChangeHoraFin(event: string) {
    this.horaFin = event;
  }

  agregarReserva() {
    var fecha = new Date(this.reserva.fecha);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    this.reserva.fecha = fecha;
    this.reserva.horaInicio = this.reserva.horaInicio.split(':')[0];
    this.reserva.horaFin = this.reserva.horaFin.split(':')[0];
    this.reserva.observaciones = 'No aplica.';
    this.reserva.estado = 'REVISION';

    this.reservaServicio.agregar(this.reserva).subscribe({
      next: data => {
        this.cerrarForm.nativeElement.click();
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
    this.reservas = [];
  }

  public editarReserva() {
    var fecha = new Date(this.reserva.fecha);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    this.reserva.fecha = fecha;
    this.reserva.horaInicio = this.reserva.horaInicio.split(':')[0];
    this.reserva.horaFin = this.reserva.horaFin.split(':')[0];

    this.reservaServicio.actualizar(this.reserva).subscribe({
      next: data => {
        this.cerrarForm.nativeElement.click();
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

  borrarReserva() {
    this.reservaServicio.eliminar("" + this.reserva.idReserva).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  limpiarCampos() {
    this.reserva.idReserva = 0;
    this.reserva.idFacultad = "";
    this.reserva.idAula = "";
    this.reserva.emisor = "";
    this.reserva.asunto = "";
    this.reserva.descripcion = "";
    this.reserva.estado = "";
    this.reserva.fecha = new Date();
    this.reserva.horaInicio = "";
    this.reserva.horaFin = "";
    this.reserva.observaciones = "";
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
        (doc as any).autoTable(this.exportColumns, this.reservas);
        doc.save('listado_reservas.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.reservas);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'listado_reservas');
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
