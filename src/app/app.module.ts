import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FileSaverModule } from 'ngx-filesaver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pagina/login/login.component';
import { InicioComponent } from './pagina/inicio/inicio.component';
import { RegistroComponent } from './pagina/registro/registro.component';
import { HomeComponent } from './pagina/home/home.component';
import { CompleteLayoutComponent } from './pagina/layout/complete-layout/complete-layout.component';
import { LoginLayoutComponent } from './pagina/layout/login-layout/login-layout.component';
import { ListaAulaComponent } from './pagina/lista-aula/lista-aula.component';
import { ListaCursoComponent } from './pagina/lista-curso/lista-curso.component';
import { CrearCursoComponent } from './pagina/curso/crear-curso/crear-curso.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListaMejoraProblemaComponent } from './pagina/mejora-problema/lista-mejora-problema/lista-mejora-problema.component';
import { CrearMejoraProblemaComponent } from './pagina/mejora-problema/crear-mejora-problema/crear-mejora-problema.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    RegistroComponent,
    HomeComponent,
    CompleteLayoutComponent,
    LoginLayoutComponent,
    ListaAulaComponent,
    ListaCursoComponent,
    CrearCursoComponent,
    ListaMejoraProblemaComponent,
    CrearMejoraProblemaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastModule,
    TableModule,
    FileSaverModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return sessionStorage.getItem("AuthToken");
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
