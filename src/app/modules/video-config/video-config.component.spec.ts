import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConfigComponent } from './video-config.component';

describe('VideoConfigComponent', () => {
  let component: VideoConfigComponent;
  let fixture: ComponentFixture<VideoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
