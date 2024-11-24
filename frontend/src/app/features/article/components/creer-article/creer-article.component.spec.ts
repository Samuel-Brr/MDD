import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreerArticleComponent } from './creer-article.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from '../../../../shared/interfaces/article.interface';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('CreerArticleComponent', () => {
  let component: CreerArticleComponent;
  let fixture: ComponentFixture<CreerArticleComponent>;
  let mockArticleService: jest.Mocked<ArticleService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  // Mock data
  const mockArticle: Article = {
    theme: 'Test Theme',
    titre: 'Test Title',
    contenu: 'Test Content'
  } as Article;

  beforeEach(async () => {
    // Create mocks
    mockArticleService = {
      creerArticle: jest.fn()
    } as unknown as jest.Mocked<ArticleService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        CreerArticleComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: ArticleService, useValue: mockArticleService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreerArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty fields', () => {
      expect(component.articleForm.get('theme')?.value).toBe('');
      expect(component.articleForm.get('titre')?.value).toBe('');
      expect(component.articleForm.get('contenu')?.value).toBe('');
    });

    it('should have required validators for all fields', () => {
      const themeControl = component.articleForm.get('theme');
      const titreControl = component.articleForm.get('titre');
      const contenuControl = component.articleForm.get('contenu');

      expect(themeControl?.hasValidator).toBeTruthy();
      expect(titreControl?.hasValidator).toBeTruthy();
      expect(contenuControl?.hasValidator).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.articleForm.valid).toBeFalsy();
    });

    it('should be invalid when only theme is provided', () => {
      component.articleForm.patchValue({ theme: 'Test Theme' });
      expect(component.articleForm.valid).toBeFalsy();
    });

    it('should be invalid when only titre is provided', () => {
      component.articleForm.patchValue({ titre: 'Test Title' });
      expect(component.articleForm.valid).toBeFalsy();
    });

    it('should be invalid when only contenu is provided', () => {
      component.articleForm.patchValue({ contenu: 'Test Content' });
      expect(component.articleForm.valid).toBeFalsy();
    });

    it('should be valid when all required fields are provided', () => {
      component.articleForm.patchValue(mockArticle);
      expect(component.articleForm.valid).toBeTruthy();
    });

    it('should show validation errors when fields are touched and empty', () => {
      const themeControl = component.articleForm.get('theme');
      const titreControl = component.articleForm.get('titre');
      const contenuControl = component.articleForm.get('contenu');

      themeControl?.markAsTouched();
      titreControl?.markAsTouched();
      contenuControl?.markAsTouched();

      expect(themeControl?.errors?.['required']).toBeTruthy();
      expect(titreControl?.errors?.['required']).toBeTruthy();
      expect(contenuControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not call creerArticle when form is invalid', () => {
      // Act
      component.onSubmit();

      // Assert
      expect(mockArticleService.creerArticle).not.toHaveBeenCalled();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
    });

    it('should call creerArticle when form is valid', () => {
      // Arrange
      mockArticleService.creerArticle.mockReturnValue(of(1));
      component.articleForm.patchValue(mockArticle);

      // Act
      component.onSubmit();

      // Assert
      expect(mockArticleService.creerArticle).toHaveBeenCalledWith(mockArticle);
    });

    it('should show success message and reset form on successful submission', () => {
      // Arrange
      mockArticleService.creerArticle.mockReturnValue(of(1));
      component.articleForm.patchValue(mockArticle);

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Article créé !',
        'OK',
        { duration: 3000 }
      );
      expect(component.articleForm.value).toEqual({
        theme: null,
        titre: null,
        contenu: null
      });
    });

    it('should show error message when article creation fails', () => {
      // Arrange
      mockArticleService.creerArticle.mockReturnValue(throwError(() => new Error('Test error')));
      component.articleForm.patchValue(mockArticle);

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la création de l\'article',
        'Fermer',
        { duration: 3000 }
      );
      // Form should not be reset on error
      expect(component.articleForm.value).toEqual(mockArticle);
    });
  });
});
