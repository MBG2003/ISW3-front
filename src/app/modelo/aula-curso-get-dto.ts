export class AulaCursoGetDTO {
    idFacultadCurso: string = "";
    idPrograma: string = "";
    idCurso: string = "";
    nombreCurso: string = "";
    idGrupo: number = 0;
    nombreGrupo: string = "";
    idFacultadAula: string = "";
    idAula: string = "";
    diaSemana: number = 0;
    horaInicio: number = 0;
    horaFin: number = 0;

    constructor(idFacultadCurso: string, idPrograma: string, idCurso: string, nombreCurso: string, idGrupo: number, nombreGrupo: string, idFacultadAula: string, idAula: string, diaSemana: number, horaInicio: number, horaFin: number) {
        this.idFacultadCurso = idFacultadCurso;
        this.idPrograma = idPrograma;
        this.idCurso = idCurso;
        this.nombreCurso = nombreCurso;
        this.idGrupo = idGrupo;
        this.nombreGrupo = nombreGrupo;
        this.idFacultadAula = idFacultadAula;
        this.idAula = idAula;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }
}
