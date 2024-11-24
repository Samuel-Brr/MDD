import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { HttpClient } from '@angular/common/http';
import { Themes } from '../../../shared/interfaces/themes';
import { of, throwError } from 'rxjs';

describe('ThemeService', () => {
  let service: ThemeService;
  let httpClientMock: jest.Mocked<HttpClient>;

  // Mock data
  const mockThemes: Themes = {
    themes: [
      {
        id: 1,
        titre: 'Angular',
        description: 'All about Angular framework',
        articles: [],
        abonnes: [1, 2, 3]
      },
      {
        id: 2,
        titre: 'TypeScript',
        description: 'TypeScript programming',
        articles: [],
        abonnes: [1]
      }
    ]
  };

  beforeEach(() => {
    // Create HttpClient mock
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getThemes', () => {
    it('should return all themes', (done) => {
      // Arrange
      httpClientMock.get.mockReturnValue(of(mockThemes));

      // Act
      service.getThemes().subscribe({
        next: (themes) => {
          // Assert
          expect(themes).toEqual(mockThemes);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/themes');
          done();
        }
      });
    });

    it('should handle error when fetching themes fails', (done) => {
      // Arrange
      const errorMessage = 'Failed to fetch themes';
      httpClientMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.getThemes().subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/themes');
          done();
        }
      });
    });
  });

  describe('subscribeTheme', () => {
    it('should successfully subscribe to a theme', (done) => {
      // Arrange
      const themeId = 1;
      httpClientMock.post.mockReturnValue(of({}));

      // Act
      service.subscribeTheme(themeId).subscribe({
        next: () => {
          // Assert
          expect(httpClientMock.post).toHaveBeenCalledWith(
            `api/themes/${themeId}/subscribe`,
            null
          );
          done();
        }
      });
    });

    it('should handle error when theme subscription fails', (done) => {
      // Arrange
      const themeId = 1;
      const errorMessage = 'Failed to subscribe to theme';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.subscribeTheme(themeId).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            `api/themes/${themeId}/subscribe`,
            null
          );
          done();
        }
      });
    });
  });

  describe('unsubscribeTheme', () => {
    it('should successfully unsubscribe from a theme', (done) => {
      // Arrange
      const themeId = 1;
      httpClientMock.post.mockReturnValue(of({}));

      // Act
      service.unsubscribeTheme(themeId).subscribe({
        next: () => {
          // Assert
          expect(httpClientMock.post).toHaveBeenCalledWith(
            `api/themes/${themeId}/unsubscribe`,
            null
          );
          done();
        }
      });
    });

    it('should handle error when theme unsubscription fails', (done) => {
      // Arrange
      const themeId = 1;
      const errorMessage = 'Failed to unsubscribe from theme';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.unsubscribeTheme(themeId).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            `api/themes/${themeId}/unsubscribe`,
            null
          );
          done();
        }
      });
    });
  });
});
