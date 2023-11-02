export class ReservaGetDTO {
    idReserva: number = 0;
    idFacultad: string = "";
    idAula: string = "";
    emisor: string = "";
    asunto: string = "";
    descripcion: string = "";
    estado: string = "";
    fecha: Date = new Date();
    horaInicio: number = 0;
    horaFin: number = 0;
    observaciones: string = "";

    constructor(idReserva: number, idFacultad: string, idAula: string, emisor: string, asunto: string, descripcion: string, estado: string, fecha: Date, horaInicio: number, horaFin: number, observaciones: string) {
        this.idReserva = idReserva;
        this.idFacultad = idFacultad;
        this.idAula = idAula;
        this.emisor = emisor;
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.observaciones = observaciones;
    }
}
