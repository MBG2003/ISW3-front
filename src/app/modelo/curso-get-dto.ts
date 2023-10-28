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
    cupos:number = 0;
    recursos:string[] = [];

    constructor(idFacultad:string, idPrograma:string, idCurso:string, idDocente:string, nombre:string, descripcion:string, pensum:string, creditos:number, nivel:number, horas:number, cupos:number, recursos:string[]) {
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
        this.cupos = cupos;
        this.recursos = recursos;
    }
}
