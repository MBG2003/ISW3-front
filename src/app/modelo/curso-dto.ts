export class CursoDTO {
    idFacultad:string = "";
    idPrograma:string = "";
    idCurso:string = "";
    idDocente:string = "";
    nombre:string = "";
    pensum:string = "";
    grupos:Grupo[] = [];
    creditos:number = 0;
    nivel:number = 0;
    horas:number = 0;
    recursos:number[] = [];
}

interface Grupo {
    idGrupo:number;
    nombre:string;
    cupos:number;
    horario:Horario[];
}

interface Horario {
    diaSemana:number;
    horaInicio:number;
    horaFin:number;
}
