import { Component, OnInit } from '@angular/core';
import { MejoraProblemaDTO } from 'src/app/modelo/mejora-problema-dto';
import { MejoraProblemaGetDTO } from 'src/app/modelo/mejora-problema-get-dto';

@Component({
  selector: 'app-lista-mejora-problema',
  templateUrl: './lista-mejora-problema.component.html',
  styleUrls: ['./lista-mejora-problema.component.css']
})
export class ListaMejoraProblemaComponent implements OnInit{
  solicitudes: MejoraProblemaGetDTO[];
  solicitud!: MejoraProblemaDTO;

  constructor() {
    this.solicitudes = [];
  }

  ngOnInit(): void {
      
  }

  public seleccionar(solicitud:MejoraProblemaGetDTO) {
    this.solicitud = solicitud;
  }

  public agregarSolicitud() {

  }

  public borrarSolicitud() {

  }
}
