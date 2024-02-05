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

  constructor(private tokenService:TokenService, private usuarioService: UsuarioService, private messageService:MessageService) {
    this.usuario = "";
    this.consultarNombre();
  }

  public logout() {
    this.tokenService.logout();
  }

  public consultarNombre() {
    this.usuarioService.consultarNombre(this.tokenService.decodePayload().userId).subscribe({
      next: data => {
        this.usuario = data.response;
      },
      error: error => {
        this.showError(error.error.message != undefined ? error.error.message : error.error);
      }
    });
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
