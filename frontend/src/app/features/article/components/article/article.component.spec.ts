import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from './article.component';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from '../../../../shared/interfaces/article.interface';
import { Articles } from '../../../../shared/interfaces/articles';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockArticleService: jest.Mocked<ArticleService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  // Mock data
  const mockArticles: Article[] = [
    {
      id: 1,
      titre: 'Article 1',
      contenu: 'Content 1',
      auteur: 'Author 1',
      date: new Date('2024-03-24'),
      theme: 'Theme 1',
      commentaires: []
    },
    {
      id: 2,
      titre: 'Article 2',
      contenu: 'Content 2',
      auteur: 'Author 2',
      date: new Date('2024-03-25'),
      theme: 'Theme 2',
      commentaires: []
    }
  ];

  beforeEach(async () => {
    // Create mocks
    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockArticleService = {
      getArticles: jest.fn()
    } as unknown as jest.Mocked<ArticleService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [
        ArticleComponent,
        DatePipe
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty articles array', () => {
    expect(component.articles).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('should load and sort articles successfully', () => {
      // Arrange
      const mockResponse: Articles = { articles: mockArticles };
      mockArticleService.getArticles.mockReturnValue(of(mockResponse));

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(mockArticleService.getArticles).toHaveBeenCalled();
      expect(component.articles).toHaveLength(2);
      // Verify sorting (newest first)
      expect(component.articles[0].id).toBe(2);
      expect(component.articles[1].id).toBe(1);
    });

    it('should handle error when loading articles fails', () => {
      // Arrange
      mockArticleService.getArticles.mockReturnValue(throwError(() => new Error('Test error')));

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(mockArticleService.getArticles).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erreur lors du chargement des articles',
        'Fermer',
        { duration: 3000 }
      );
      expect(component.articles).toEqual([]);
    });
  });

  describe('sortArticles', () => {
    it('should sort articles by date in descending order', () => {
      // Arrange
      const unsortedArticles = [...mockArticles].reverse();

      // Act
      const sortedArticles = component['sortArticles'](unsortedArticles);

      // Assert
      expect(sortedArticles[0].id).toBe(2); // Newest article
      expect(sortedArticles[1].id).toBe(1); // Oldest article
    });

    it('should handle articles with same date', () => {
      // Arrange
      const sameDate = new Date('2024-03-24');
      const articlesWithSameDate = [
        { ...mockArticles[0], date: sameDate },
        { ...mockArticles[1], date: sameDate }
      ];

      // Act
      const sortedArticles = component['sortArticles'](articlesWithSameDate);

      // Assert
      expect(sortedArticles).toHaveLength(2);
      expect(new Date(sortedArticles[0].date).getTime())
        .toBe(new Date(sortedArticles[1].date).getTime());
    });
  });

  describe('navigation', () => {
    it('should navigate to article creation page', () => {
      // Act
      component.navigateToCreerArticle();

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles/creer']);
    });

    it('should navigate to article detail page with correct id', () => {
      // Arrange
      const articleId = 1;

      // Act
      component.navigateToArticle(articleId);

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles/detail', articleId]);
    });
  });
});
