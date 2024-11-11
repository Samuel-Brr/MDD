import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerArticleComponent } from './creer-article.component';

describe('CreerArticleComponent', () => {
  let component: CreerArticleComponent;
  let fixture: ComponentFixture<CreerArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
