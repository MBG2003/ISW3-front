import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pagina/login/login.component';
import { HomeComponent } from './pagina/home/home.component';
import { CompleteLayoutComponent } from './pagina/layout/complete-layout/complete-layout.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ListaAulaComponent } from './pagina/lista-aula/lista-aula.component';
import { ListaCursoComponent } from './pagina/lista-curso/lista-curso.component';
import { ListaMejoraProblemaComponent } from './pagina/mejora-problema/lista-mejora-problema/lista-mejora-problema.component';

const routes: Routes = [
  {title: "SGA | Login" ,path: "gestion_aulas/login", component: LoginComponent},
  {title: "SGA", path: "gestion_aulas", component: CompleteLayoutComponent, children: [
    {path: "", component: HomeComponent},
    {title: "SGA | Listado de Aulas",path: "listado_aulas", component: ListaAulaComponent},
    {path: "listado_cursos", component: ListaCursoComponent},
    {path: "listado_mejoras_problemas", component: ListaMejoraProblemaComponent}
  ], canActivate: [AuthGuard]},
  {path: "**", pathMatch: "full", redirectTo: "gestion_aulas"},
  {path: "", pathMatch: "full", redirectTo: "gestion_aulas"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
