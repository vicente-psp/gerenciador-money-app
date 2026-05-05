import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { FinanceGroup } from '../models/finance-group.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceGroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/finance-groups`;

  // Signals para o estado global do Finance Group
  private _financeGroups = signal<FinanceGroup[]>([]);
  private _activeFinanceGroup = signal<FinanceGroup | null>(null);

  financeGroups = computed(() => this._financeGroups());
  activeFinanceGroup = computed(() => this._activeFinanceGroup());

  constructor() {
    this.loadFinanceGroups();
  }

  loadFinanceGroups(): Observable<FinanceGroup[]> {
    return this.http.get<FinanceGroup[]>(this.apiUrl).pipe(
      tap(groups => {
        this._financeGroups.set(groups);
        
        // Tenta recuperar do localStorage
        const savedId = localStorage.getItem('activeFinanceGroupId');
        const savedGroup = groups.find(g => g.id === savedId);

        if (savedGroup) {
          this._activeFinanceGroup.set(savedGroup);
        } else {
          // Se não tiver no localStorage, busca o grupo padrão (isDefault)
          const defaultGroup = groups.find(g => g.isDefault);
          if (defaultGroup) {
            this.setActiveFinanceGroup(defaultGroup);
          } else if (groups.length > 0) {
            // Se não tiver padrão, pega o primeiro da lista
            this.setActiveFinanceGroup(groups[0]);
          }
        }
      })
    );
  }

  setActiveFinanceGroup(group: FinanceGroup) {
    this._activeFinanceGroup.set(group);
    if (group) {
      localStorage.setItem('activeFinanceGroupId', group.id);
    }
  }

  create(group: Partial<FinanceGroup>): Observable<FinanceGroup> {
    return this.http.post<FinanceGroup>(this.apiUrl, group).pipe(
      tap(() => this.loadFinanceGroups().subscribe())
    );
  }

  update(id: string, group: Partial<FinanceGroup>): Observable<FinanceGroup> {
    return this.http.put<FinanceGroup>(`${this.apiUrl}/${id}`, group).pipe(
      tap(() => this.loadFinanceGroups().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this._activeFinanceGroup()?.id === id) {
          this._activeFinanceGroup.set(null);
        }
        this.loadFinanceGroups().subscribe();
      })
    );
  }
}
