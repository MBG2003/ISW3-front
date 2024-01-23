import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FileSaverModule } from 'ngx-filesaver';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import * as moment from 'moment-timezone'
import { adapterFactory } from 'angular-calendar/date-adapters/moment';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListaMejoraProblemaComponent } from './pagina/lista-mejora-problema/lista-mejora-problema.component';
import { ListaReservaComponent } from './pagina/lista-reserva/lista-reserva.component';
import { HorarioAulaComponent } from './pagina/horario-aula/horario-aula.component';
import { AsignarHorarioComponent } from './pagina/asignar-horario/asignar-horario.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

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
    ListaMejoraProblemaComponent,
    ListaReservaComponent,
    HorarioAulaComponent,
    AsignarHorarioComponent
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
    MultiSelectModule,
    DropdownModule,
    TagModule,
    NgxMaterialTimepickerModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return sessionStorage.getItem("AuthToken");
        }
      }
    })
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
