import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SesionDTO } from 'src/app/modelo/sesion-dto';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  registroForm!:FormGroup;
  sesion:SesionDTO;

  ngOnInit(): void {
    
  }

  constructor(private authServicio: AuthService, private tokenServicio:TokenService, private messageService:MessageService) {
    this.sesion = new SesionDTO();
  }

  public login() {
    this.authServicio.login(this.sesion).subscribe({
      next: data => {
        this.tokenServicio.login(data.response);
        this.showSuccess(data.message);
      },
      error: error => {
        this.showError(error.error.message);
      }
    })
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
