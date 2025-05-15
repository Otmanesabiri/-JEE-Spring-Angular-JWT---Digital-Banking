import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest, User, ChangePasswordRequest } from '../models/user.model';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private jwtHelper = new JwtHelperService();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$ = this.currentUserSubject.asObservable();
  
  isAuthenticated$ = this.user$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.storeUser({
          username: response.username,
          roles: response.roles
        });
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, registerRequest);
  }

  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword`, changePasswordRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes('ADMIN') || false;
  }
}
