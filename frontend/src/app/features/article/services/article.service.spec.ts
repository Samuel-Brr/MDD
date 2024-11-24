import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from './article.service';
import { Article } from '../../../shared/interfaces/article.interface';
import { Articles } from '../../../shared/interfaces/articles';
import { I_Comment } from '../../../shared/interfaces/comment.interface';
import { of, throwError } from 'rxjs';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpClientMock: jest.Mocked<HttpClient>;

  // Mock data
  const mockArticles: Articles = {
    articles: [
      { id: 1, titre: 'Test Article 1', contenu: 'Content 1' } as any,
      { id: 2, titre: 'Test Article 2', contenu: 'Content 2' } as any
    ]
  };

  const mockArticle: Article = {
    id: 1,
    titre: 'Test Article',
    contenu: 'Test Content'
  } as any;

  const mockComment: I_Comment = {
    contenu: 'Test Comment'
  } as any;

  beforeEach(() => {
    // Create HttpClient mock
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        ArticleService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getArticles', () => {
    it('should return all articles', (done) => {
      // Arrange
      httpClientMock.get.mockReturnValue(of(mockArticles));

      // Act
      service.getArticles().subscribe({
        next: (articles) => {
          // Assert
          expect(articles).toEqual(mockArticles);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/articles');
          done();
        }
      });
    });

    it('should handle error when fetching articles fails', (done) => {
      // Arrange
      const errorMessage = 'Failed to fetch articles';
      httpClientMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.getArticles().subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/articles');
          done();
        }
      });
    });
  });

  describe('creerArticle', () => {
    it('should create a new article', (done) => {
      // Arrange
      const articleId = 1;
      httpClientMock.post.mockReturnValue(of(articleId));

      // Act
      service.creerArticle(mockArticle).subscribe({
        next: (id) => {
          // Assert
          expect(id).toBe(articleId);
          expect(httpClientMock.post).toHaveBeenCalledWith('api/articles', mockArticle);
          done();
        }
      });
    });

    it('should handle error when creating article fails', (done) => {
      // Arrange
      const errorMessage = 'Failed to create article';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.creerArticle(mockArticle).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith('api/articles', mockArticle);
          done();
        }
      });
    });
  });

  describe('getById', () => {
    it('should return article by id', (done) => {
      // Arrange
      const articleId = '1';
      httpClientMock.get.mockReturnValue(of(mockArticle));

      // Act
      service.getById(articleId).subscribe({
        next: (article) => {
          // Assert
          expect(article).toEqual(mockArticle);
          expect(httpClientMock.get).toHaveBeenCalledWith(`api/articles/${articleId}`);
          done();
        }
      });
    });

    it('should handle error when fetching article by id fails', (done) => {
      // Arrange
      const articleId = '1';
      const errorMessage = 'Failed to fetch article';
      httpClientMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.getById(articleId).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.get).toHaveBeenCalledWith(`api/articles/${articleId}`);
          done();
        }
      });
    });
  });

  describe('ajouterCommentaire', () => {
    it('should add comment to article', (done) => {
      // Arrange
      const articleId = 1;
      const commentId = 1;
      httpClientMock.post.mockReturnValue(of(commentId));

      // Act
      service.ajouterCommentaire(articleId, mockComment).subscribe({
        next: (id) => {
          // Assert
          expect(id).toBe(commentId);
          expect(httpClientMock.post).toHaveBeenCalledWith(`api/articles/${articleId}`, mockComment);
          done();
        }
      });
    });

    it('should handle error when adding comment fails', (done) => {
      // Arrange
      const articleId = 1;
      const errorMessage = 'Failed to add comment';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.ajouterCommentaire(articleId, mockComment).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(`api/articles/${articleId}`, mockComment);
          done();
        }
      });
    });
  });
});
