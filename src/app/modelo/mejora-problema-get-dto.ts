export class MejoraProblemaGetDTO {
    emisor:string = "";
    idFacultad:string = "";
    idAula:string = "";
    idSolicitud:number = 0;
    descripcion:string = "";
    observaciones:string = "";
    estado:string = "";

    constructor(idFacultad: string, idAula:string, idSolicitud:number, descripcion:string, emisor:string, observaciones:string, estado:string) {
        this.idFacultad = idFacultad;
        this.idAula = idAula;
        this.idSolicitud = idSolicitud;
        this.descripcion = descripcion;
        this.emisor = emisor;
        this.observaciones = observaciones;
        this.estado = estado;
    }
}
