import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { Factory } from '../../models/factories/factory.model';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  private http = inject(HttpClient);

  // GET ALL → JSON
  getAll() {
    return this.http.get<Factory[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getAll}`, { responseType: 'json' });
  }

  // GET BY ID → JSON
  getById(id: number) {
    return this.http.get<Factory>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getById(id)}`, { responseType: 'json' });
  }

  // GET DETAILS → JSON
  getDetails(id: number) {
    return this.http.get(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getDetails(id)}`, { responseType: 'json' });
  }

  search(name: string) {
    return this.http.get<Factory[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.search(name)}`, { responseType: 'json' });
  }


  // POST → TEXT
  create(model: Factory) {
    return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.create}`, model, { responseType: 'text' });
  }

  // PUT → TEXT
  update(model: Factory) {
    return this.http.put(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.update(model.id)}`, model, { responseType: 'text' });
  }

  // DELETE → TEXT
  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.delete(id)}`, { responseType: 'text' });
  }
}
