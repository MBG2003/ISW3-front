export class CursoGetDTO {
    idFacultad:string = "";
    idPrograma:string = "";
    idCurso:string = "";
    idDocente:string = "";
    nombre:string = "";
    descripcion:string = "";
    pensum:string = "";
    creditos:number = 0;
    nivel:number = 0;
    horas:number = 0;
    grupos: Grupo[];
    recursos:string[] = [];

    constructor(idFacultad:string, idPrograma:string, idCurso:string, idDocente:string, nombre:string, descripcion:string, pensum:string, creditos:number, nivel:number, horas:number, grupos: Grupo[], recursos:string[]) {
        this.idFacultad = idFacultad;
        this.idPrograma = idPrograma;
        this.idCurso = idCurso;
        this.idDocente = idDocente;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.pensum = pensum;
        this.creditos = creditos;
        this.nivel = nivel;
        this.horas = horas;
        this.grupos = grupos;
        this.recursos = recursos;
    }
}


interface Grupo {
    idGrupo: number;
    nombre: string;
    cupos: number;
    horario: Horario[];
}

interface Horario {
    idHorario:number;
    diaSemana:number;
    horaInicio:number;
    horaFin:number;
}