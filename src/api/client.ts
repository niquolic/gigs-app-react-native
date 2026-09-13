import axios from "axios";
import environment from "@/config/env";

/**
 * Instance Axios unique, pointant vers le même backend Spring Boot
 * que le front Angular (voir services/*.service.ts d'origine).
 */
const apiClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 15000,
});

export default apiClient;
