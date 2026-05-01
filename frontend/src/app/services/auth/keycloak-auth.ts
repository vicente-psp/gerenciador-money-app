import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  private keycloak!: Keycloak;
  private platformId = inject(PLATFORM_ID);

  async init() {
    if (!isPlatformBrowser(this.platformId)) return false;

    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        // Desabilitando o iframe de status por padrão para evitar o 403 
        // caso o Web Origin não esteja 100% mapeado no Keycloak.
        checkLoginIframe: false 
      });
      return authenticated;
    } catch (error) {
      console.error('Falha ao inicializar Keycloak em:', environment.keycloak.url, error);
      return false;
    }
  }

  login() {
    if (this.keycloak) return this.keycloak.login();
    return Promise.resolve();
  }

  logout() {
    if (this.keycloak) return this.keycloak.logout();
    return Promise.resolve();
  }

  get token() {
    return this.keycloak?.token;
  }

  get isLoggedIn() {
    return !!this.keycloak?.token;
  }

  get roles() {
    return this.keycloak?.realmAccess?.roles || [];
  }
}
