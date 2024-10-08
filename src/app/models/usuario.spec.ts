import { Usuario } from './usuario';

describe('Usuario', () => {
  it('should create an instance', () => {
    const usuario = new Usuario(1, 'Pedro', 'pedro@example.com', 'Password-10', 1, '+56999999999', 'foto.png');
    expect(usuario).toBeTruthy();
    expect(usuario.id_usuario).toBe(1);
    expect(usuario.nombre_usuario).toBe('Pedro');
    expect(usuario.telefono).toBe('+56999999999'); 
  });
});

