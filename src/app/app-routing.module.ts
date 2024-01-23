import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pagina/login/login.component';
import { HomeComponent } from './pagina/home/home.component';
import { CompleteLayoutComponent } from './pagina/layout/complete-layout/complete-layout.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ListaAulaComponent } from './pagina/lista-aula/lista-aula.component';
import { ListaCursoComponent } from './pagina/lista-curso/lista-curso.component';
import { ListaMejoraProblemaComponent } from './pagina/lista-mejora-problema/lista-mejora-problema.component';
import { ListaReservaComponent } from './pagina/lista-reserva/lista-reserva.component';
import { HorarioAulaComponent } from './pagina/horario-aula/horario-aula.component';
import { AsignarHorarioComponent } from './pagina/asignar-horario/asignar-horario.component';

const routes: Routes = [
  {title: "SGA | Login" ,path: "gestion_aulas/login", component: LoginComponent},
  {title: "SGA", path: "gestion_aulas", component: CompleteLayoutComponent, children: [
    {path: "", component: HomeComponent},
    {title: "SGA | Listado de Aulas",path: "listado_aulas", component: ListaAulaComponent},
    {title: "SGA | Horario de Aulas",path: "asignar_aulas", component: AsignarHorarioComponent},
    {title: "SGA | Asignación de Aulas",path: "horario_aulas", component: HorarioAulaComponent},
    {title: "SGA | Listado de Cursos", path: "listado_cursos", component: ListaCursoComponent},
    {title: "SGA | Listado de Reservas", path: "listado_reservas", component: ListaReservaComponent},
    {title: "SGA | Listado de Mejoras y Problemas", path: "listado_mejoras_problemas", component: ListaMejoraProblemaComponent}
  ], canActivate: [AuthGuard]},
  {path: "**", pathMatch: "full", redirectTo: "gestion_aulas"},
  {path: "", pathMatch: "full", redirectTo: "gestion_aulas"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
