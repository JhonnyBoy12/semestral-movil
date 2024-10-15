import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Publicacion } from '../models/publicacion';
import { Ubicacion } from '../models/ubicacion';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  public usuarioSesionSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public usuarioSesion$ = this.usuarioSesionSubject.asObservable();

  //CONEXION BASE DE DATOS
  public database!: SQLiteObject;

  //===BASE DE DATOS TABLAS===
  rol:string = "CREATE TABLE IF NOT EXISTS rol(id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol TEXT NOT NULL);";

  administrador: string = "CREATE TABLE IF NOT EXISTS administrador(id_administrador INTEGER PRIMARY KEY AUTOINCREMENT, id_rol INTEGER NOT NULL, nombre TEXT NOT NULL, correo_electronico TEXT NOT NULL, contrasena TEXT NOT NULL, telefono TEXT NOT NULL, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  usuario: string = "CREATE TABLE IF NOT EXISTS usuarios(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario TEXT NOT NULL, correo_usuario TEXT NOT NULL, contrasena_usuario TEXT NOT NULL, id_rol INTEGER NOT NULL, telefono NUMBER NOT NULL, foto TEXT, FOREIGN KEY (id_rol) REFERENCES rol (id_rol));";

  categoria: string = "CREATE TABLE IF NOT EXISTS categorias(id_categoria INTEGER PRIMARY KEY AUTOINCREMENT, nombre_categoria TEXT NOT NULL);";

  comuna: string = "CREATE TABLE IF NOT EXISTS comunas(id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre_comuna TEXT NOT NULL);";

  establecimiento: string = "CREATE TABLE IF NOT EXISTS establecimientos(id_establecimiento INTEGER PRIMARY KEY AUTOINCREMENT, tipo_establecimiento TEXT NOT NULL);";

  especie: string = "CREATE TABLE IF NOT EXISTS especies(id_especie INTEGER PRIMARY KEY AUTOINCREMENT, nombre_especie TEXT NOT NULL);";

  servicio: string = "CREATE TABLE IF NOT EXISTS servicios(id_servicio INTEGER PRIMARY KEY AUTOINCREMENT, nombre_servicio TEXT NOT NULL);";

  ubicacion: string = "CREATE TABLE IF NOT EXISTS ubicaciones(id_ubicacion INTEGER PRIMARY KEY AUTOINCREMENT, nombre_ubicacion TEXT NOT NULL, direccion TEXT NOT NULL, sububicacion TEXT NOT NULL, descripcion_ubicacion TEXT NOT NULL, horario TEXT NOT NULL, imagen_ubicacion TEXT NOT NULL, telefono_lugar TEXT NOT NULL, id_administrador INTEGER NOT NULL, id_comuna INTEGER NOT NULL, latitud REAL NOT NULL, longitud REAL NOT NULL, tipo_marcador TEXT NOT NULL, visibilidad BOOLEAN NOT NULL, id_establecimiento INTEGER, id_especie INTEGER, id_servicio INTEGER, FOREIGN KEY (id_administrador) REFERENCES administrador (id_administrador), FOREIGN KEY (id_comuna) REFERENCES comunas (id_comuna), FOREIGN KEY (id_establecimiento) REFERENCES establecimientos (id_establecimiento), FOREIGN KEY (id_especie) REFERENCES especies (id_especie), FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio));";

  publicacion: string = "CREATE TABLE IF NOT EXISTS publicaciones(id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, titulo TEXT NOT NULL, foto TEXT NOT NULL, descripcion TEXT NOT NULL, fecha_publicacion DATE NOT NULL, fecha_baneo DATE, descripcion_baneo TEXT, publicacion_adopcion BOOLEAN, id_categoria INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria));";

  publicacionGuardada: string = "CREATE TABLE IF NOT EXISTS publicaciones_guardadas(id_guardado INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER NOT NULL, id_publicacion INTEGER NOT NULL, FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), FOREIGN KEY (id_publicacion) REFERENCES publicaciones (id_publicacion));";


  ////INSERTS TABLA ROL
  rolAdmin: string = "INSERT or IGNORE INTO rol(id_rol, nombre_rol ) VALUES (1, 'Administrador')";
  rolUsuario: string = "INSERT or IGNORE INTO rol(id_rol, nombre_rol ) VALUES (2, 'Usuario')";

  ////INSERTS TABLA COMUNAS
  comunaSantiago: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Santiago')";
  comunaProvidencia: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Providencia')";
  comunaLasCondes: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Las Condes')";
  comunaVitacura: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Vitacura')";
  comunaNunoa: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Ñuñoa')";
  comunaMacul: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Macul')";
  comunaLaFlorida: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('La Florida')";
  comunaPudahuel: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Pudahuel')";
  comunaMaipu: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Maipú')";
  comunaQuilicura: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Quilicura')";
  comunaEstacionCentral: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Estación Central')";
  comunaIndependencia: string = "INSERT OR IGNORE INTO comunas(nombre_comuna) VALUES ('Independencia')";

  ////INSERTS TABLA ESTABLECIMIENTOS
  establecimientoVeterinaria: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Veterinaria')";
  establecimientoRescate: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Centro de rescate')";
  establecimientoEstilista: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Estilista')";
  establecimientoTiendaComida: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Tienda de comida')";
  establecimientoGuarderia: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Guardería/Hotel para mascotas')";
  establecimientoAdiestramiento: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Adiestramiento')";
  establecimientoFarmacia: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Farmacia para animales')";
  establecimientoServiciosAdopcion: string = "INSERT OR IGNORE INTO establecimientos(tipo_establecimiento) VALUES ('Servicios de adopción')";

  ////INSERTS TABLA CATEGORIAS
  categoriaPerros: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Perros')";
  categoriaGatos: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Gatos')";
  categoriaPerrosYGatos: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Perros y Gatos')";
  categoriaRoedores: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Roedores')";
  categoriaOtros: string = "INSERT OR IGNORE INTO categorias(nombre_categoria) VALUES ('Otros')";

  ////INSERTS TABLA ESPECIES
  especiePerros: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Perros')";
  especieGatos: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Gatos')";
  especiePerrosGatos: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Perros y Gatos')";
  especieAves: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Aves')";
  especiePeces: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Peces')";
  especieReptiles: string = "INSERT OR IGNORE INTO especies(nombre_especie) VALUES ('Reptiles')";
  //// INSERTS TABLA SERVICIOS

  servicioConsultaMedica: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Consulta médica')";
  servicioCirugia: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Cirugía')";
  servicioVacunacion: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Vacunación')";
  servicioBanoPeluqueria: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Baño y peluquería')";
  servicioAdopcion: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Adopción')";
  servicioVentaProductos: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Venta de productos')";
  servicioCuidadoDental: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Cuidado dental')";
  servicioGuarderia: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Guardería o cuidado temporal')";
  servicioDomicilio: string = "INSERT OR IGNORE INTO servicios(nombre_servicio) VALUES ('Servicio a domicilio')";

  //// INSERTS TABLA UBICACIONES

  

  //SUPER ADMIN
  superAdmin: string = "INSERT OR IGNORE INTO administrador (id_rol, nombre, correo_electronico, contrasena, telefono) VALUES (1, 'SuperAdmin', 'admin@gmail.com', 'Admin.12345', '1234567890')";
  ////////////////////////////

  ////===OBSERVABLES Y GUARDADOS TABLA "USUARIOS"///////////////
  
  //variable de guardado SELECT
  listadoUsuarios = new BehaviorSubject<Usuario[]>([]);

  //Observable
  fetchUsuarios(): Observable<Usuario[]>{
    return this.listadoUsuarios.asObservable();
  }


  ////===OBSERVABLES Y GUARDADOS TABLA "USUARIOS del admin"///////////////
  
  //variable de guardado SELECT
  listadoUsuariosAdmin = new BehaviorSubject<Usuario[]>([]);

  //Observable
  fetchUsuariosAdmin(): Observable<Usuario[]>{
    return this.listadoUsuariosAdmin.asObservable();
  }
  ////////////////////////////////////////////////////////////


  ////===OBSERVABLES Y GUARDADOS TABLA "PUBLICACIONES"///////////////
  
  //variable de guardado SELECT
  listadoPublicaciones = new BehaviorSubject([]);

  //Observable
  fetchPublicaciones(): Observable<Publicacion[]>{
    return this.listadoPublicaciones.asObservable();
  }

  // Variable para guardar las publicaciones del usuario
  listadoPublicacionesUsuario = new BehaviorSubject([]);

  // Observable
  fetchPublicacionesUsuario(): Observable<any[]> {
    return this.listadoPublicacionesUsuario.asObservable();
  }
  ////////////////////////////////////////////////////////////
  

  ////===OBSERVABLES Y GUARDADOS TABLA "UBICACIONES"///////////////
  
  //variable de guardado SELECT
  listadoUbicaciones = new BehaviorSubject([]);

  //Observable
  fetchUbicaciones(): Observable<Ubicacion[]>{
    return this.listadoUbicaciones.asObservable();
  }
  ////////////////////////////////////////////////////////////
  
  dbState(){
    return this.isDBReady.asObservable();
  }

  //VARIABLE DE MANIPULACION DE BASE DE DATOS
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController, private storage: NativeStorage) {
    this.crearBD();
   }

   async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }


  ////funcion creacion de la bd
   crearBD(){
    //VERIFICACION DE PLATAFORMA
    this.platform.ready().then(()=>{
      //PROCEDIMIENTO CREACION BD
      this.sqlite.create({
        name: 'petCareMap.db',
        location:'default'
      }).then((db: SQLiteObject)=>{
        //CAPTURA Y CONEXION BASE DE DATOS
        this.database = db;
        //CREACION ORDEN TABLAS
        this.crearTablas();
        //FUNCIONES POR DEFECTO AL CREAR CONECTAR
        this.consultarPublicaciones();
        this.consultarUbicaciones();
        //MODIFICACION OBSERVABLE DEL STATUS DE BASE DE DATOS
        this.isDBReady.next(true);
      }).catch(e=>{
        this.presentAlert("Creación de BD", "Error creando la BD: " + JSON.stringify(e));
      })
    })
   }

   async crearTablas(){
    try{
      //ORDEN DE EJECUCION POR TABLA
      await this.database.executeSql(this.rol,[]);
      await this.database.executeSql(this.administrador, []);
      await this.database.executeSql(this.usuario, []);
      await this.database.executeSql(this.categoria, []);
      await this.database.executeSql(this.comuna, []);
      await this.database.executeSql(this.establecimiento, []);
      await this.database.executeSql(this.especie, []);
      await this.database.executeSql(this.servicio, []);
      await this.database.executeSql(this.ubicacion, []);
      await this.database.executeSql(this.publicacion, []);
      await this.database.executeSql(this.publicacionGuardada, []);

      ///---GENERACION DE INSERTS EN TABLAS REQUERIDAS---///

      // Insert para la tabla de roles
      await this.database.executeSql(this.rolAdmin, []);
      await this.database.executeSql(this.rolUsuario, []);

      // Insert para la tabla de categori­as de publicaciones
      await this.database.executeSql(this.categoriaPerros, []);
      await this.database.executeSql(this.categoriaGatos, []);
      await this.database.executeSql(this.categoriaPerrosYGatos, []);
      await this.database.executeSql(this.categoriaRoedores, []);
      await this.database.executeSql(this.categoriaOtros, []);

      // Insert para la tabla de comunas
      await this.database.executeSql(this.comunaSantiago, []);
      await this.database.executeSql(this.comunaProvidencia, []);
      await this.database.executeSql(this.comunaLasCondes, []);
      await this.database.executeSql(this.comunaVitacura, []);
      await this.database.executeSql(this.comunaNunoa, []);
      await this.database.executeSql(this.comunaMacul, []);
      await this.database.executeSql(this.comunaLaFlorida, []);
      await this.database.executeSql(this.comunaPudahuel, []);
      await this.database.executeSql(this.comunaMaipu, []);
      await this.database.executeSql(this.comunaQuilicura, []);
      await this.database.executeSql(this.comunaEstacionCentral, []);
      await this.database.executeSql(this.comunaIndependencia, []);

      // Insert para la tabla de establecimientos
      await this.database.executeSql(this.establecimientoVeterinaria, []);
      await this.database.executeSql(this.establecimientoRescate, []);
      await this.database.executeSql(this.establecimientoEstilista, []);
      await this.database.executeSql(this.establecimientoTiendaComida, []);
      await this.database.executeSql(this.establecimientoGuarderia, []);
      await this.database.executeSql(this.establecimientoAdiestramiento, []);
      await this.database.executeSql(this.establecimientoFarmacia, []);
      await this.database.executeSql(this.establecimientoServiciosAdopcion, []);

      // Insert para la tabla de especies
      await this.database.executeSql(this.especiePerros, []);
      await this.database.executeSql(this.especieGatos, []);
      await this.database.executeSql(this.especiePerrosGatos, []);
      await this.database.executeSql(this.especieAves, []);
      await this.database.executeSql(this.especiePeces, []);
      await this.database.executeSql(this.especieReptiles, []);

      // Insert para la tabla de servicios
      await this.database.executeSql(this.servicioConsultaMedica, []);
      await this.database.executeSql(this.servicioCirugia, []);
      await this.database.executeSql(this.servicioVacunacion, []);
      await this.database.executeSql(this.servicioBanoPeluqueria, []);
      await this.database.executeSql(this.servicioAdopcion, []);
      await this.database.executeSql(this.servicioVentaProductos, []);
      await this.database.executeSql(this.servicioCuidadoDental, []);
      await this.database.executeSql(this.servicioGuarderia, []);
      await this.database.executeSql(this.servicioDomicilio, []);
      
      // Insert para el administrador SuperAdmin
      await this.database.executeSql(this.superAdmin, []);

    }catch(e){
      this.presentAlert("Creación de Tabla", "Error creando las Tablas: " + JSON.stringify(e));
    }
  }

  /////CONSULTA COMPLETA USUARIO + INSERCCION ListadoUsuarios
  consultarUsuarioActivo(id_usuario: number): Promise<Usuario | null> {
    const query = 'SELECT id_usuario, nombre_usuario, correo_usuario, telefono, foto, contrasena_usuario, id_rol FROM usuarios WHERE id_usuario = ?';

    return this.database.executeSql(query, [id_usuario])
      .then(res => {
        if (res.rows.length > 0) {
          const usuarioActivo: Usuario = {
            id_usuario: res.rows.item(0).id_usuario,
            nombre_usuario: res.rows.item(0).nombre_usuario,
            correo_usuario: res.rows.item(0).correo_usuario,  // Correo electrónico
            telefono: res.rows.item(0).telefono,  // Teléfono
            foto: res.rows.item(0).foto,  // Foto del perfil
            id_rol: res.rows.item(0).id_rol,
            contrasena_usuario: res.rows.item(0).contrasena_usuario  // Contraseña
          };

          // Emitir el usuario activo en el observable
          this.listadoUsuarios.next([usuarioActivo]);

          // Retornar los datos del usuario activo
          return usuarioActivo;
        } else {
          console.warn('No se encontró el usuario activo con ID:', id_usuario);
          this.listadoUsuarios.next([]);
          return null;  // No se encontró el usuario
        }
      })
      .catch(e => {
        console.error('Error al consultar usuario activo:', e);
        this.presentAlert("Consultar Usuario Activo", "Error: " + JSON.stringify(e));
        return null;
      });
  }

  

  /////////////////////////////

  async iniciarSesion(usuario: any) {
    await this.storage.setItem('usuario_sesion', usuario);

  
    this.listadoUsuarios.next([usuario]); // Actualiza el observable con el nuevo usuario
    this.usuarioSesionSubject.next(usuario); // Asegura que los datos se actualicen en la sesión
  }

  /////CONSULTA COMPLETA PUBLICACIONES + INSERCCION ListadoPublicaciones
  consultarPublicaciones(): Promise<any[]> {
    const query = `
      SELECT p.id_publicacion, p.titulo, p.foto, p.descripcion, p.fecha_publicacion, 
             u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
             c.nombre_categoria AS categoria
      FROM publicaciones p 
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_publicacion DESC
    `;
    
    return this.database.executeSql(query, []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_publicacion: res.rows.item(i).id_publicacion,
            titulo: res.rows.item(i).titulo,
            foto: res.rows.item(i).foto,
            descripcion: res.rows.item(i).descripcion,
            nombre_usuario: res.rows.item(i).nombre_usuario,
            foto_perfil: res.rows.item(i).foto_perfil,
            telefono: res.rows.item(i).telefono,
            categoria: res.rows.item(i).categoria  
          });
        }
      }
      return items;
    }).catch(e => {
      this.presentAlert("Consultar PUBLICACIONES vista foro", "Error: " + JSON.stringify(e));
      throw e;  // Lanza el error para que pueda ser capturado en `cargarPublicaciones()`
    });
  }

  consultarPublicacionesGuardadas(id_usuario: number): Promise<any[]> {
    const query = `
      SELECT pg.id_guardado, p.id_publicacion, p.titulo, p.foto, p.descripcion, 
             u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
             c.nombre_categoria AS categoria
      FROM publicaciones_guardadas pg
      JOIN publicaciones p ON pg.id_publicacion = p.id_publicacion
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE pg.id_usuario = ?
      ORDER BY pg.id_guardado DESC
    `;

    return this.database.executeSql(query, [id_usuario]).then(res => {
        let items: any[] = [];
        if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {
                items.push({
                    id_guardado: res.rows.item(i).id_guardado,
                    id_publicacion: res.rows.item(i).id_publicacion,
                    titulo: res.rows.item(i).titulo,
                    foto: res.rows.item(i).foto,
                    descripcion: res.rows.item(i).descripcion,
                    nombre_usuario: res.rows.item(i).nombre_usuario,
                    foto_perfil: res.rows.item(i).foto_perfil,
                    telefono: res.rows.item(i).telefono,
                    categoria: res.rows.item(i).categoria
                });
            }
        }
        return items;
    }).catch(e => {
        this.presentAlert("Consultar PUBLICACIONES GUARDADAS", "Error: " + JSON.stringify(e));
        throw e;  // Lanza el error para que pueda ser capturado donde se llama
    });
  }
  
  
  /////////////////////////////

  /////CONSULTA COMPLETA UBICACIONES + INSERCCION ListadoUbicaciones
  consultarUbicaciones() {
    const query = `SELECT nombre_ubicacion, direccion, telefono_lugar FROM ubicaciones`;
    return this.database.executeSql(query, []).then(res => {
      let items: Ubicacion[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_ubicacion: res.rows.item(i).id_ubicacion,
            nombre_ubicacion: res.rows.item(i).nombre_ubicacion,
            direccion: res.rows.item(i).direccion,
            sububicacion: res.rows.item(i).sububicacion,
            descripcion_ubicacion: res.rows.item(i).descripcion_ubicacion,
            horario: res.rows.item(i).horario,
            imagen_ubicacion: res.rows.item(i).imagen_ubicacion,
            telefono_lugar: res.rows.item(i).telefono_lugar,
            id_administrador: res.rows.item(i).id_administrador,
            id_comuna: res.rows.item(i).id_comuna,
            latitud: res.rows.item(i).latitud,
            longitud: res.rows.item(i).longitud,
            tipo_marcador: res.rows.item(i).tipo_marcador,
            visibilidad: res.rows.item(i).visibilidad
          });
        }
      }
      this.listadoUbicaciones.next(items as any);
    }).catch(e => {
      console.error('Error al consultar ubicaciones', e);
    });
  }
  /////////////////////////////
  
  //INGRESO DE USUARIO (REGISTRAR USUARIO)
  ingresarUsuario(nombreUsuario: string, email: string, contra: string, id_rol: number, telefono: string) {
    const query = `INSERT INTO usuarios (nombre_usuario, correo_usuario, contrasena_usuario, id_rol, telefono) VALUES (?, ?, ?, ?, ?)`;
    return this.database.executeSql(query, [nombreUsuario, email, contra, id_rol, telefono])
        .then(() => console.log('Usuario registrado correctamente'))
        .catch(e => console.error('Error al registrar el usuario', e));
  }

  //ACTUALIZAR FOTO USUARIO
  actualizarFotoUsuario(id_usuario: number, foto: string) {
    const query = `UPDATE usuarios SET foto = ? WHERE id_usuario = ?`;
    return this.database.executeSql(query, [foto, id_usuario])
      .then(() => console.log('Foto actualizada correctamente'))
      .catch(e => console.error('Error al actualizar la foto', e));
  }

  

  //METODOS INICIAR SESION
  // Método para validar el usuario e iniciar sesión
  async validarUsuario(email: string, contra: string) {
    const query = `SELECT id_usuario, nombre_usuario, id_rol, foto, telefono, correo_usuario
                   FROM usuarios 
                   WHERE correo_usuario = ? AND contrasena_usuario = ?`;
    
    const result = await this.database.executeSql(query, [email, contra]);
    
    if (result.rows.length > 0) {
        const usuario = result.rows.item(0);
        
        // Guarda los datos completos del usuario en el almacenamiento nativo
        await this.storage.setItem('usuario_sesion', {
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre_usuario,
          id_rol: usuario.id_rol,
          foto: usuario.foto,  // Incluye la foto
          telefono: usuario.telefono,  // Otros datos si son necesarios
          email: usuario.correo_usuario,
          contrasena_usuario: usuario.contrasena_usuario
        });

        return usuario;
    } else {
        return null; // Usuario no encontrado
    }
}


  // Método para validar el administrador e iniciar sesión
  async validarAdmin(email: string, contra: string) {
    const query = `SELECT id_administrador, nombre, id_rol FROM administrador WHERE correo_electronico = ? AND contrasena = ?`;
    
    const result = await this.database.executeSql(query, [email, contra]);
    
    if (result.rows.length > 0) {
        const admin = result.rows.item(0);
        
        // Guarda los datos del administrador en el almacenamiento nativo
        await this.storage.setItem('usuario_sesion', {
            id_usuario: admin.id_administrador,  // Usa id_administrador aquí
            nombre_usuario: admin.nombre,
            id_rol: admin.id_rol
        });

        return admin;
    } else {
        return null; // Administrador no encontrado
    }
  }
  /////////////////////////////////////////

    agregarPublicacion(publicacion: { id_usuario: number; titulo: string; foto: string; descripcion: string; fecha_publicacion: Date; publicacion_adopcion: boolean; id_categoria: number; }): Promise<void> {

      const { id_usuario, titulo, foto, descripcion, publicacion_adopcion, id_categoria } = publicacion;
      
      return this.database.executeSql(
        'INSERT INTO publicaciones (id_usuario, titulo, foto, descripcion, fecha_publicacion, publicacion_adopcion, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_usuario, titulo, foto, descripcion, new Date(), publicacion_adopcion, id_categoria]
      )
      .then(() => {
        this.presentAlert('Realizado', 'Publicación hecha correctamente');
      })
      .catch(e => {
        this.presentAlert('Error al añadir la publicación', `Error: ${JSON.stringify(e)}`);
        return Promise.reject('Error al añadir la publicación'); // Propagar el error
      });
    }

    consultarPublicacionesPorUsuario(id_usuario: number): Promise<any[]> {
      const query = `
        SELECT p.id_publicacion, p.titulo, p.foto, p.descripcion, p.fecha_publicacion, 
               u.nombre_usuario, u.telefono, u.foto AS foto_perfil, 
               c.nombre_categoria AS categoria
        FROM publicaciones p 
        JOIN usuarios u ON p.id_usuario = u.id_usuario
        JOIN categorias c ON p.id_categoria = c.id_categoria
        WHERE p.id_usuario = ?
        ORDER BY p.id_publicacion DESC
      `;
      
      return this.database.executeSql(query, [id_usuario]).then(res => {
        let items: any[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            items.push({
              id_publicacion: res.rows.item(i).id_publicacion,
              titulo: res.rows.item(i).titulo,
              foto: res.rows.item(i).foto,
              descripcion: res.rows.item(i).descripcion,
              nombre_usuario: res.rows.item(i).nombre_usuario,
              foto_perfil: res.rows.item(i).foto_perfil,
              telefono: res.rows.item(i).telefono,
              categoria: res.rows.item(i).categoria
            });
          }
        }
        return items;
      }).catch(e => {
        this.presentAlert("Consultar PUBLICACIONES propias", "Error: " + JSON.stringify(e));
        throw e;
      });
    }

    consultarUsuariosAdmin(){
      const query = `SELECT * FROM usuarios`;
    return this.database.executeSql(query, []).then(res => {
      let items: Usuario[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            nombre_usuario: res.rows.item(i).nombre_usuario,
            correo_usuario: res.rows.item(i).corre_usuario,
            telefono: res.rows.item(i).telefono,
            foto: res.rows.item(i).foto,
            id_usuario: 0,
            contrasena_usuario: '',
            id_rol: 0
          });
        }
      }
      this.listadoUsuariosAdmin.next(items as any);
    }).catch(e => {
      console.error('Error al consultar usuarios', e);
    });
    }

    async obtenerUsuarioSesion(): Promise<any> {
      try {
        const usuarioSesion = await this.storage.getItem('usuario_sesion');
        return usuarioSesion;
      } catch (error) {
        console.error('Error al obtener la sesión del usuario', error);
        return null;
      }
    }

    actualizarContrasenaUsuario(id_usuario: number, contrasenaActual: string, nuevaContrasena: string): Promise<void> {
      // Primero, validamos que la contraseña actual sea correcta
      const queryValidar = `SELECT * FROM usuarios WHERE id_usuario = ? AND contrasena_usuario = ?`;
    
      return this.database.executeSql(queryValidar, [id_usuario, contrasenaActual]).then(result => {
        if (result.rows.length > 0) {
          // La contraseña actual es correcta, procedemos a actualizar
          const queryActualizar = `UPDATE usuarios SET contrasena_usuario = ? WHERE id_usuario = ?`;
          return this.database.executeSql(queryActualizar, [nuevaContrasena, id_usuario])
            .then(() => {
              console.log('Contraseña actualizada correctamente');
            })
            .catch(e => {
              console.error('Error al actualizar la contraseña', e);
              throw e;
            });
        } else {
          throw new Error('Contraseña actual incorrecta');
        }
      }).catch(e => {
        console.error('Error al validar la contraseña actual', e);
        throw e;
      });
    }

    guardarPublicacion(id_usuario: number, id_publicacion: number): Promise<void> {
      const query = `
        INSERT INTO publicaciones_guardadas (id_usuario, id_publicacion) 
        VALUES (?, ?)
      `;
  
      return this.database.executeSql(query, [id_usuario, id_publicacion]).then(() => {
          console.log('Publicación guardada correctamente');
      }).catch(e => {
          this.presentAlert("Guardar PUBLICACION", "Error: " + JSON.stringify(e));
          throw e;  // Lanza el error si es necesario manejarlo
      });
    }

    validarPublicacionGuardada(id_usuario: number, id_publicacion: number): Promise<boolean> {
      const query = `
          SELECT COUNT(*) as count
          FROM publicaciones_guardadas
          WHERE id_usuario = ? AND id_publicacion = ?
      `;
  
      return this.database.executeSql(query, [id_usuario, id_publicacion]).then(res => {
          return res.rows.item(0).count > 0; // Devuelve true si ya está guardada
      }).catch(e => {
          console.error("Error al verificar publicación guardada:", e);
          return false; // En caso de error, consideramos que no está guardada
      });
    }
    

    
}


  
