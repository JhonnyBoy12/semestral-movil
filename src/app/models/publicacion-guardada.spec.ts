import { PublicacionGuardada } from './publicacion-guardada';

describe('PublicacionGuardada', () => {
  it('should create an instance', () => {
    const publicacionGuardada = new PublicacionGuardada(1, 1, 1);
    expect(publicacionGuardada).toBeTruthy();
    expect(publicacionGuardada.id_guardado).toBe(1);
  });
});

