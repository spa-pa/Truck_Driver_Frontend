import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPagesComponent } from './modify-pages.component';

describe('ModifyPagesComponent', () => {
  let component: ModifyPagesComponent;
  let fixture: ComponentFixture<ModifyPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
