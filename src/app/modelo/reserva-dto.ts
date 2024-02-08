export class ReservaDTO {
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
}
