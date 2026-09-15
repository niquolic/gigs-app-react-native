/**
 * Équivalent des fichiers environment.ts / environment.prod.ts du projet Angular.
 * En dev, remplace "localhost" par l'IP de ta machine sur le réseau local
 * (ou 10.0.2.2 pour l'émulateur Android) si tu testes le backend en local,
 * un simulateur/téléphone ne peut pas résoudre "localhost" vers ton PC.
 */
type EnvConfig = {
  apiUrl: string;
  production: boolean;
};

const ENV: Record<"development" | "production", EnvConfig> = {
  development: {
    production: false,
    apiUrl: "http://192.168.1.127:8080", //remettre 127.0.0.1
  },
  production: {
    production: true,
    apiUrl: "https://springboot-backend-513726246973.europe-west1.run.app",
  },
};

const environment: EnvConfig = __DEV__ ? ENV.development : ENV.production;

export default environment;
