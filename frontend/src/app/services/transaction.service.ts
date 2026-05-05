import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;

  getAll(filters?: any, financeGroupId?: string): Observable<Transaction[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }
    if (financeGroupId) {
      params = params.append('financeGroupId', financeGroupId);
    }
    return this.http.get<Transaction[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  create(transaction: Partial<Transaction>, financeGroupId?: string): Observable<Transaction> {
    const body = { ...transaction };
    if (financeGroupId) {
      (body as any).financeGroupId = financeGroupId;
    }
    return this.http.post<Transaction>(this.apiUrl, body);
  }

  update(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
