import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import {jwtDecode} from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function get_UserData(){
    
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return null;
  }
  const decodedToken = jwtDecode(token);
  return decodedToken;  
}

export function isJwtValid(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function checkRole(token: string, role: string[]) {
  const decodedToken = jwtDecode(token);
  return role.includes(decodedToken.role);
}