import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionUsuarioPage } from './publicacion-usuario.page';

describe('PublicacionUsuarioPage', () => {
  let component: PublicacionUsuarioPage;
  let fixture: ComponentFixture<PublicacionUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
