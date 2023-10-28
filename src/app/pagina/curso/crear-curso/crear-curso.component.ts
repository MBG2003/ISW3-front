import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListaCursoComponent } from '../../lista-curso/lista-curso.component';
import { CursoDTO } from 'src/app/modelo/curso-dto';
import { FacultadGetDTO } from 'src/app/modelo/facultad-get-dto';
import { FacultadService } from 'src/app/servicios/facultad.service';
import { ProgramaGetDTO } from 'src/app/modelo/programa-get-dto';
import { ProgramaService } from 'src/app/servicios/programa.service';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent implements OnInit{

  facultades:FacultadGetDTO[];
  programas:ProgramaGetDTO[];

  constructor(
    private facultadService:FacultadService,
    private programaService:ProgramaService,
    public dialogRef: MatDialogRef<ListaCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CursoDTO,
  ) {
    this.facultades = [];
    this.programas = [];
  }

  ngOnInit(): void {
      this.facultadService.listar().subscribe({
        next: data => {
          this.facultades = data.response
        }
      });

      this.programaService.listar().subscribe({
        next: data => {
          this.programas = data.response
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
