import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounts`;

  getAll(financeGroupId?: string): Observable<Account[]> {
    let params = new HttpParams();
    if (financeGroupId) {
      params = params.append('financeGroupId', financeGroupId);
    }
    return this.http.get<Account[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  create(account: Partial<Account>, financeGroupId?: string): Observable<Account> {
    const body = { ...account };
    if (financeGroupId) {
      (body as any).financeGroupId = financeGroupId;
    }
    return this.http.post<Account>(this.apiUrl, body);
  }

  update(id: string, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
