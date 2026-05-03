import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Workspace } from '../models/workspace.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/finance-groups`;

  // Signals para o estado global do Workspace
  private _workspaces = signal<Workspace[]>([]);
  private _activeWorkspace = signal<Workspace | null>(null);

  workspaces = computed(() => this._workspaces());
  activeWorkspace = computed(() => this._activeWorkspace());

  constructor() {
    this.loadWorkspaces();
  }

  loadWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(this.apiUrl).pipe(
      tap(workspaces => {
        this._workspaces.set(workspaces);
        
        // Tenta recuperar do localStorage
        const savedId = localStorage.getItem('activeWorkspaceId');
        const savedWorkspace = workspaces.find(w => w.id === savedId);

        if (savedWorkspace) {
          this._activeWorkspace.set(savedWorkspace);
        } else if (!this._activeWorkspace() && workspaces.length > 0) {
          this.setActiveWorkspace(workspaces[0]);
        }
      })
    );
  }

  setActiveWorkspace(workspace: Workspace) {
    this._activeWorkspace.set(workspace);
    if (workspace) {
      localStorage.setItem('activeWorkspaceId', workspace.id);
    }
  }

  create(workspace: Partial<Workspace>): Observable<Workspace> {
    return this.http.post<Workspace>(this.apiUrl, workspace).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  update(id: string, workspace: Partial<Workspace>): Observable<Workspace> {
    return this.http.put<Workspace>(`${this.apiUrl}/${id}`, workspace).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (this._activeWorkspace()?.id === id) {
          this._activeWorkspace.set(null);
        }
        this.loadWorkspaces().subscribe();
      })
    );
  }
}
