import { Component } from '@angular/core';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-complete-layout',
  templateUrl: './complete-layout.component.html',
  styleUrls: ['./complete-layout.component.css']
})
export class CompleteLayoutComponent {
  title = 'SISTEMA DE GESTIÓN DE AULAS';
  usuario = 'Mateo Baez Guevara';

  constructor(private tokenService:TokenService) {}

  public logout() {
    this.tokenService.logout();
  }
}
