import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub: string;
  userId: number;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}

/** Équivalent de TokenService.isTokenExpired() */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decoded = decodeToken(token);
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate <= new Date();
  } catch {
    return true;
  }
}
