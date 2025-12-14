import { Injectable } from '@angular/core';
import { API_CONFIG } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  apiUrl = API_CONFIG.baseUrl;

  constructor() {}
}
