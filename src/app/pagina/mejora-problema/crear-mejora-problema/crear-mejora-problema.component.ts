import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListaMejoraProblemaComponent } from '../lista-mejora-problema/lista-mejora-problema.component';
import { MejoraProblemaGetDTO } from 'src/app/modelo/mejora-problema-get-dto';
import { MejoraProblemaDTO } from 'src/app/modelo/mejora-problema-dto';

@Component({
  selector: 'app-crear-mejora-problema',
  templateUrl: './crear-mejora-problema.component.html',
  styleUrls: ['./crear-mejora-problema.component.css']
})
export class CrearMejoraProblemaComponent {
  constructor(
    public dialogRef: MatDialogRef<ListaMejoraProblemaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MejoraProblemaDTO,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
