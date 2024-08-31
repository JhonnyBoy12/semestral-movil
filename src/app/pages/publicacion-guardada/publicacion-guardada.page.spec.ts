import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionGuardadaPage } from './publicacion-guardada.page';

describe('PublicacionGuardadaPage', () => {
  let component: PublicacionGuardadaPage;
  let fixture: ComponentFixture<PublicacionGuardadaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionGuardadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
