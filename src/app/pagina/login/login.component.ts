import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SesionDTO } from 'src/app/modelo/sesion-dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registroForm!:FormGroup;
  sesion:SesionDTO;

  ngOnInit(): void {
      this.crearFormulario();
  }

  constructor(private formBuilder: FormBuilder) {
    this.sesion = new SesionDTO();
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      documento: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      contrasenia: new FormControl('', [Validators.required, Validators.maxLength(50)])
    });
  }

  public login() {
    console.log(this.registroForm.value);
  }
}
