import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'jwt_token';
  private refreshTokenKey = 'refresh_token';
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.loadStoredUser();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password
    });
  }

  logout(): void {
    this.storageService.removeItem(this.tokenKey);
    this.storageService.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of({ token: '', username: '', roles: [] } as AuthResponse);
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  getToken(): string | null {
    return this.storageService.getItem(this.tokenKey);
  }

  private getRefreshToken(): string | null {
    return this.storageService.getItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setSession(authResult: AuthResponse): void {
    this.storageService.setItem(this.tokenKey, authResult.token);
    if (authResult.refreshToken) {
      this.storageService.setItem(this.refreshTokenKey, authResult.refreshToken);
    }
    
    this.currentUserSubject.next({
      username: authResult.username,
      roles: authResult.roles
    });
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token) {
      // For now we're just setting a basic user object when token exists
      this.currentUserSubject.next({
        username: 'Stored User',
        roles: []
      });
    }
  }
}
