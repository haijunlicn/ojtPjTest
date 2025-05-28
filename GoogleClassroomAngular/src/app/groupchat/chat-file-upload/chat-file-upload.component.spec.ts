import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFileUploadComponent } from './chat-file-upload.component';

describe('ChatFileUploadComponent', () => {
  let component: ChatFileUploadComponent;
  let fixture: ComponentFixture<ChatFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
