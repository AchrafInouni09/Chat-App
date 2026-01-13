import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// profile functions
export async function delete_Profile() {
  const token = Cookies.get('token');
  if (!token) {
    return { success: false, error: 'No authentication token found' };
  }

  try {
    const response = await fetch('http://localhost:3000/api/Profile/me', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to delete profile' };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { success: false, error: 'Network error occurred' };
  }
}

export async function update_ProfileData(profileData: {
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
}) {
  const token = Cookies.get('token');
  if (!token) {
    return { success: false, error: 'No authentication token found' };
  }

  try {
    const response = await fetch('http://localhost:3000/api/Profile/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // avatar: profileData.avatar,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        username: profileData.username,
        bio: profileData.bio,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to update profile' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: 'Network error occurred' };
  }
}


export async function get_ProfileData() {

  const token = Cookies.get('token');
  if (!token) {
    return null; // or throw error
  }

  try {
    const response = await fetch('http://localhost:3000/api/Profile/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch profile");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
// token functions
export function isJwtValid(token: string) {
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