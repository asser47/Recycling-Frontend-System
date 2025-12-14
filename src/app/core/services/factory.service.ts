import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factory } from '../models/factory.model';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  private http = inject(HttpClient);
  private base = 'https://localhost:4375/api/Factory';

  // GET ALL → JSON
  getAll() {
    return this.http.get<Factory[]>(this.base, { responseType: 'json' });
  }

  // GET BY ID → JSON
  getById(id: number) {
    return this.http.get<Factory>(`${this.base}/${id}`, { responseType: 'json' });
  }

  // GET DETAILS → JSON
  getDetails(id: number) {
    return this.http.get(`${this.base}/${id}/details`, { responseType: 'json' });
  }

  search(name: string) {
    return this.http.get<Factory[]>(`${this.base}/type/${name}`, { responseType: 'json' });
  }


  // POST → TEXT
  create(model: Factory) {
    return this.http.post(this.base, model, { responseType: 'text' });
  }

  // PUT → TEXT
  update(model: Factory) {
    return this.http.put(this.base, model, { responseType: 'text' });
  }

  // DELETE → TEXT
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' });
  }
}
