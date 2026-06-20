import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuLanguageComponent } from './cu-language.component';

describe('CuLanguageComponent', () => {
  let component: CuLanguageComponent;
  let fixture: ComponentFixture<CuLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuLanguageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
