import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionesAdminPage } from './publicaciones-admin.page';

describe('PublicacionesAdminPage', () => {
  let component: PublicacionesAdminPage;
  let fixture: ComponentFixture<PublicacionesAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
