import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ArticleDetailComponent} from './article-detail.component';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArticleService} from '../../services/article.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Article} from '../../../../shared/interfaces/article.interface';
import {of, throwError} from 'rxjs';
import {DatePipe} from '@angular/common';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockArticleService: jest.Mocked<ArticleService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  // Mock data
  const mockArticleId = '123';
  const mockArticle: Article = {
    id: 123,
    titre: 'Test Article',
    contenu: 'Test Content',
    auteur: 'Test Author',
    date: new Date(),
    theme: 'Test Theme',
    commentaires: [
      { id: 1, contenu: 'Test Comment', auteur: 'Test Commenter' }
    ]
  };

  beforeEach(async () => {
    // Create mocks
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: mockArticleId })
      }
    } as any;

    mockArticleService = {
      getById: jest.fn(),
      ajouterCommentaire: jest.fn()
    } as unknown as jest.Mocked<ArticleService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ArticleDetailComponent,
        ReactiveFormsModule,
        DatePipe,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    // Setup default successful response
    mockArticleService.getById.mockReturnValue(of(mockArticle));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty article', () => {
      expect(component.article).toEqual({} as Article);
    });

    it('should create comment form with required validation', () => {
      expect(component.commentForm.get('contenu')).toBeTruthy();
      expect(component.commentForm.get('contenu')?.hasValidator(Validators.required)).toBeTruthy();
    });

    it('should load article details on init when ID is present', () => {
      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(mockArticleService.getById).toHaveBeenCalledWith(mockArticleId);
      expect(component.article).toEqual(mockArticle);
    });

    it('should handle missing article id in route params', () => {
      // Arrange
      mockActivatedRoute.snapshot = {
        paramMap: convertToParamMap({})
      } as any;

      // Act
      fixture.detectChanges();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Error: Article ID not found',
        'Close',
        { duration: 3000 }
      );
    });

    it('should handle error when loading article fails', () => {
      // Arrange
      mockArticleService.getById.mockReturnValue(throwError(() => new Error('Test error')));

      // Act
      fixture.detectChanges();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de la récupération de l\'article',
        'Close',
        { duration: 3000 }
      );
    });
  });

  describe('Comment Form', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be invalid when empty', () => {
      expect(component.commentForm.valid).toBeFalsy();
    });

    it('should be valid with content', () => {
      // Act
      component.commentForm.patchValue({ contenu: 'Test comment content' });

      // Assert
      expect(component.commentForm.valid).toBeTruthy();
    });

    it('should show validation error when content is touched and empty', () => {
      // Arrange
      const contenuControl = component.commentForm.get('contenu');

      // Act
      contenuControl?.markAsTouched();

      // Assert
      expect(contenuControl?.hasError('required')).toBeTruthy();
    });
  });

  describe('Comment Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not submit when form is invalid', () => {
      // Act
      component.onSubmit();

      // Assert
      expect(mockArticleService.ajouterCommentaire).not.toHaveBeenCalled();
    });

    it('should submit comment when form is valid', () => {
      // Arrange
      mockArticleService.ajouterCommentaire.mockReturnValue(of(1));
      component.commentForm.patchValue({ contenu: 'Test comment' });

      // Act
      component.onSubmit();

      // Assert
      expect(mockArticleService.ajouterCommentaire).toHaveBeenCalledWith(
        mockArticle.id,
        { contenu: 'Test comment' }
      );
    });

    it('should handle successful comment submission', () => {
      // Arrange
      mockArticleService.ajouterCommentaire.mockReturnValue(of(1));
      component.commentForm.patchValue({ contenu: 'Test comment' });

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Commentaire ajouté !',
        'OK',
        { duration: 3000 }
      );
      expect(component.commentForm.value).toEqual({ contenu: null });
      expect(mockArticleService.getById).toHaveBeenCalledTimes(2); // Initial load + refresh
    });

    it('should handle error during comment submission', () => {
      // Arrange
      mockArticleService.ajouterCommentaire.mockReturnValue(throwError(() => new Error('Test error')));
      component.commentForm.patchValue({ contenu: 'Test comment' });

      // Act
      component.onSubmit();

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors de l\'ajout du commentaire',
        'Fermer',
        { duration: 3000 }
      );
    });
  });
});
