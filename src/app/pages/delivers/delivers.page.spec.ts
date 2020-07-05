import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeliversPage } from './delivers.page';

describe('DeliversPage', () => {
  let component: DeliversPage;
  let fixture: ComponentFixture<DeliversPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliversPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
