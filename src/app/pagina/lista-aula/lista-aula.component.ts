import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import { AulaDTO } from 'src/app/modelo/aula-dto';
import { AulaGetDTO } from 'src/app/modelo/aula-get-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { AulaService } from 'src/app/servicios/aula.service';
import { FacultadService } from 'src/app/servicios/facultad.service';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-aula',
  templateUrl: './lista-aula.component.html',
  styleUrls: ['./lista-aula.component.css'],
  providers: [MessageService]
})
export class ListaAulaComponent implements OnInit {

  @ViewChild('f') f!: NgForm;
  formEnviado = false;

  nombreArchivo!: string;

  cols!: Column[];
  exportColumns!: ExportColumn[];
  textoEliminar: string;
  esEdicion!: boolean;
  aulas: AulaGetDTO[];
  selectedAulas!: AulaGetDTO[];
  aula: AulaDTO;
  facultades: FacultadGetDTO[];
  recursos: Recurso[] = [
    { idRecurso: 0, nombre: 'COMPUTADORA', checked: false },
    { idRecurso: 1, nombre: 'VIDEOBEAM', checked: false }
  ]

  constructor(private aulaServicio: AulaService, private facultadServicio: FacultadService, private messageService: MessageService, private fileSaverService: FileSaverService) {
    this.textoEliminar = "";
    this.aulas = [];
    this.facultades = [];
    this.aula = new AulaDTO();
  }

  ngOnInit(): void {
    this.facultadServicio.listar().subscribe({
      next: data => {
        this.facultades = data.response;
      }
    });

    this.listar();

    this.cols = [
      { field: 'idAula', header: 'ID Aula' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'idFacultad', header: 'Facultad' },
      { field: 'capacidad', header: 'Capacidad' },
      { field: 'estado', header: 'Estado' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onAulasCSVChange(event: any) {
    if(event.target.files.length > 0){
      this.nombreArchivo = event.target.files[0].name;
    }
  }

  editar(aula: AulaGetDTO) {
    this.recursos.map(r => r.checked = false);
    this.aula.idFacultad = aula.idFacultad;
    this.aula.idAula = aula.idAula;
    this.aula.nombre = aula.nombre;
    this.aula.capacidad = aula.capacidad;
    this.aula.estado = aula.estado;
    this.recursos.map(r1 => {
      let recursoIndex = aula.recursos.findIndex(r2 => r1.nombre === r2);
      if (recursoIndex !== -1) {
        r1.checked = true;
      }
    });
    this.esEdicion = true;
  }

  cambiarTxtEliminar(aula: AulaGetDTO) {
    this.aula.idFacultad = aula.idFacultad;
    this.aula.idAula = aula.idAula;
    this.textoEliminar = aula.idAula;
  }

  listar() {
    this.aulaServicio.listar().subscribe({
      next: data => {
        this.aulas = data.response;
      },
      error: error => {
        this.aulas = [];
      }
    });
  }

  agregarAula() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.aula.recursos.push(r.idRecurso);
      }
    });

    this.aulaServicio.agregar(this.aula).subscribe({
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

  editarAula() {
    this.recursos.map(r => {
      if (r.checked === true) {
        this.aula.recursos.push(r.idRecurso);
      }
    });


    this.aulaServicio.actualizar(this.aula).subscribe({
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
    this.aulas = [];
  }

  borrarAula() {
    this.aulaServicio.eliminar(this.aula.idFacultad, this.aula.idAula).subscribe({
      next: data => {
        this.showSuccess(data.message);
        this.listar();
      },
      error: error => {
        this.showError(error.error.message);
      }
    });
  }

  estaEnLista(idRecurso: any, recursos: any[]): boolean {
    return recursos.findIndex(r => r === idRecurso) !== -1;
  }

  limpiarCampos() {
    this.aula.idFacultad = "";
    this.aula.idAula = "";
    this.aula.nombre = "";
    this.aula.estado = "";
    this.aula.capacidad = 0;
    this.aula.recursos = [];
    this.recursos.map(r => r.checked = false);
  };

  private cargarRecursosAula() {
    for (let recurso of this.aula.recursos) {
      let index = this.recursos.findIndex(r => r.idRecurso === recurso);
      if (index !== -1) {
        this.recursos[index].checked = true;
      }
    }
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

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.aulas);
        doc.save('listado_aulas.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.aulas);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'listado_aulas');
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
