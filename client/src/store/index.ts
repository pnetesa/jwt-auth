import { User } from '../models/user';
import { makeAutoObservable } from 'mobx';
import AuthService from '../services/auth-service';
import axios from 'axios';
import { AuthResponse } from '../models/response/auth-response';
import { API_URL } from '../http';

export default class Store {
  public user = {} as User;
  public isAuth = false;
  public isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  public setAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  public setUser(user: User) {
    this.user = user;
  }

  public setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  public async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log('login: ', response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  public async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log('registration: ', response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  public async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as User);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    }
  }

  public async checkAuth() {
    this.setIsLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      console.log('checkAuth: ', response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.error(e.response?.data?.message);
    } finally {
      this.setIsLoading(false);
    }
  }
}
