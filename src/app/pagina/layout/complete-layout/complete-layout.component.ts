import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TokenService } from 'src/app/servicios/token.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-complete-layout',
  templateUrl: './complete-layout.component.html',
  styleUrls: ['./complete-layout.component.css'],
  providers: [MessageService]
})
export class CompleteLayoutComponent {
  usuario: String;
  isAdmin: boolean;

  constructor(private tokenService:TokenService, private messageService:MessageService) {
    this.usuario = "";
    this.consultarNombre();
    this.isAdmin = tokenService.decodePayload().authorities == 'ADMINISTRADOR';
  }

  public logout() {
    this.tokenService.logout();
  }

  public consultarNombre() {
    this.usuario = this.tokenService.decodePayload().name;
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
}