import { Component } from '@angular/core';
import { TokenService } from './servicios/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SISTEMA DE GESTIÓN DE AULAS';
  isLogged = false;
  username:string = '';

  constructor(private tokenService: TokenService) { }
  ngOnInit(): void {
    this.isLogged = this.tokenService.isLogged();
    if (this.isLogged) {
      this.username = this.tokenService.getUsername();
    }
  }
  
  public logout() {
    this.tokenService.logout();
  }
}
