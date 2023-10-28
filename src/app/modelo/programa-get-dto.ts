export class ProgramaGetDTO {
    idFacultad:string = "";
    idPrograma:string = "";
    nombre:string = "";
    descripcion:string = "";

    constructor(idFacultad:string, idPrograma:string, nombre:string, descripcion:string) {
        this.idFacultad = idFacultad;
        this.idPrograma = idPrograma;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
}
