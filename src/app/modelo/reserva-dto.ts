export class ReservaDTO {
    idReserva: number = 0;
    idFacultad: string = "";
    idAula: string = "";
    emisor: string = "";
    asunto: string = "";
    descripcion: string = "";
    estado: string = "";
    fecha: Date = new Date();
    horaInicio: string = "";
    horaFin: string = "";
    observaciones: string = "";
}
