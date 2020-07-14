import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PausedPage } from './paused.page';

describe('PausedPage', () => {
  let component: PausedPage;
  let fixture: ComponentFixture<PausedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PausedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PausedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
