import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  getAll(financeGroupId?: string): Observable<Category[]> {
    let params = new HttpParams();
    if (financeGroupId) {
      params = params.append('financeGroupId', financeGroupId);
    }
    return this.http.get<Category[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(category: Partial<Category>, financeGroupId?: string): Observable<Category> {
    const body = { ...category };
    if (financeGroupId) {
      (body as any).financeGroupId = financeGroupId;
    }
    return this.http.post<Category>(this.apiUrl, body);
  }

  update(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
