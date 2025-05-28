import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitTestingComponent } from './git-testing.component';

describe('GitTestingComponent', () => {
  let component: GitTestingComponent;
  let fixture: ComponentFixture<GitTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GitTestingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
