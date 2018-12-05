export interface OAuthService {
  getAuthorizationUri(
    baseUri: string,
    clientId: string,
    scopes: string[],
    redirectUri: string
  ): string;
}

export class BasicOAuthService implements OAuthService {
  getAuthorizationUri(
    baseUri: string,
    clientId: string,
    scopes: string[],
    redirectUri: string
  ): string {
    const uri = `${baseUri}?response_type=token&client_id=${clientId}${
      scopes ? `&scope=${scopes.map(scope => encodeURIComponent(scope)).join("+")}` : ""
    }&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return uri;
  }
}
