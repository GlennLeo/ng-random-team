import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineUploadComponent } from './timeline-upload.component';

describe('TimelineUploadComponent', () => {
  let component: TimelineUploadComponent;
  let fixture: ComponentFixture<TimelineUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
