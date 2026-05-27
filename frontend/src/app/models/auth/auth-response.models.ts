//representa respuesta del backend
import { User } from "../users.models";

export interface AuthResponse {

  token: string;

  user: User;

}