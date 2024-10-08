import { Publicacion } from './publicacion';

describe('Publicacion', () => {
  it('should create an instance', () => {
    const publicacion = new Publicacion(1, 1, 'Adopto un perro', 'foto.png', 'Descripción de la publicación', new Date(), true,1,undefined,'descripcion del baneo');
    expect(publicacion).toBeTruthy();
    expect(publicacion.id_publicacion).toBe(1);
    expect(publicacion.titulo).toBe('Adopto un perro');
  });
});
