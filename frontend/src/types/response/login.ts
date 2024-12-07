import { CommonResponse } from "../common";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export type LoginResponse = CommonResponse<User>;
