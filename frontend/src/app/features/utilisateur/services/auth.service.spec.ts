import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from '../../../shared/interfaces/sessionInformation.interface';
import { Credentials } from '../interfaces/credentials.interface';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientMock: jest.Mocked<HttpClient>;

  // Mock data
  const mockCredentials: Credentials = {
    username: 'testUser',
    email: 'test@example.com'
  };

  const mockRegisterRequest: RegisterRequest = {
    username: 'testUser',
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  const mockLoginRequest: LoginRequest = {
    emailOrUsername: 'test@example.com',
    password: 'TestPassword123!'
  };

  const mockSessionInformation: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(() => {
    // Create HttpClient mock
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCredentials', () => {
    it('should fetch user credentials successfully', (done) => {
      // Arrange
      httpClientMock.get.mockReturnValue(of(mockCredentials));

      // Act
      service.getCredentials().subscribe({
        next: (credentials) => {
          // Assert
          expect(credentials).toEqual(mockCredentials);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/auth/credentials');
          done();
        }
      });
    });

    it('should handle error when fetching credentials fails', (done) => {
      // Arrange
      const errorMessage = 'Failed to fetch credentials';
      httpClientMock.get.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.getCredentials().subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.get).toHaveBeenCalledWith('api/auth/credentials');
          done();
        }
      });
    });
  });

  describe('updateCredentials', () => {
    it('should update credentials successfully', (done) => {
      // Arrange
      httpClientMock.put.mockReturnValue(of(void 0));

      // Act
      service.updateCredentials(mockCredentials).subscribe({
        next: () => {
          // Assert
          expect(httpClientMock.put).toHaveBeenCalledWith(
            'api/auth/credentials',
            mockCredentials
          );
          done();
        }
      });
    });

    it('should handle error when updating credentials fails', (done) => {
      // Arrange
      const errorMessage = 'Failed to update credentials';
      httpClientMock.put.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.updateCredentials(mockCredentials).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.put).toHaveBeenCalledWith(
            'api/auth/credentials',
            mockCredentials
          );
          done();
        }
      });
    });
  });

  describe('register', () => {
    it('should register user successfully', (done) => {
      // Arrange
      httpClientMock.post.mockReturnValue(of(void 0));

      // Act
      service.register(mockRegisterRequest).subscribe({
        next: () => {
          // Assert
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/register',
            mockRegisterRequest
          );
          done();
        }
      });
    });

    it('should handle error when registration fails', (done) => {
      // Arrange
      const errorMessage = 'Registration failed';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.register(mockRegisterRequest).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/register',
            mockRegisterRequest
          );
          done();
        }
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', (done) => {
      // Arrange
      httpClientMock.post.mockReturnValue(of(mockSessionInformation));

      // Act
      service.login(mockLoginRequest).subscribe({
        next: (session) => {
          // Assert
          expect(session).toEqual(mockSessionInformation);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/login',
            mockLoginRequest
          );
          done();
        }
      });
    });

    it('should handle error when login fails', (done) => {
      // Arrange
      const errorMessage = 'Login failed';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/login',
            mockLoginRequest
          );
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', (done) => {
      // Arrange
      httpClientMock.post.mockReturnValue(of(void 0));

      // Act
      service.logout().subscribe({
        next: () => {
          // Assert
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/logout',
            null
          );
          done();
        }
      });
    });

    it('should handle error when logout fails', (done) => {
      // Arrange
      const errorMessage = 'Logout failed';
      httpClientMock.post.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      service.logout().subscribe({
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/auth/logout',
            null
          );
          done();
        }
      });
    });
  });
});
