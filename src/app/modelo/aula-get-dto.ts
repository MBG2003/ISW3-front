export class AulaGetDTO {
    idFacultad:string ="";
    idAula:string ="";
    nombre:string ="";
    capacidad:number = 0;
    estado:string = "";
    recursos:any[] = []

    constructor(idFacultad:string, idAula:string, nombre:string, capacidad:number, estado:string, recursos:number[]) {
        this.idFacultad = idFacultad;
        this.idAula = idAula;
        this.nombre = nombre;
        this.capacidad = capacidad;
        this.estado = estado;
        this.recursos = recursos;
    }
}
