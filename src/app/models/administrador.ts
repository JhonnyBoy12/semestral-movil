export class Administrador {
    id_administrador!: number;
    id_rol!: number;
    nombre!: string;
    correo_electronico!: string;
    contrasena!: string;
    telefono!: string;
  
    constructor(id_administrador: number, id_rol: number, nombre: string, correo_electronico: string, contrasena: string, telefono: string) {
      this.id_administrador = id_administrador;
      this.id_rol = id_rol;
      this.nombre = nombre;
      this.correo_electronico = correo_electronico;
      this.contrasena = contrasena;
      this.telefono = telefono;
    }
  }
  