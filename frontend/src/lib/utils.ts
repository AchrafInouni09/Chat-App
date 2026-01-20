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
  avatar?: File | string | null;
  firstName?: string;
  lastName?: string;
  // username?: string;
  bio?: string;
}) {
  const token = Cookies.get('token');
  if (!token) {
    return { success: false, error: 'No authentication token found' };
  }

  try {
    // Use FormData to support file upload
    const formData = new FormData();

    if (profileData.firstName) formData.append('first_name', profileData.firstName);
    if (profileData.lastName) formData.append('last_name', profileData.lastName);
    if (profileData.bio) formData.append('bio', profileData.bio);

    // If avatar is a File object (new upload), append it
    if (profileData.avatar instanceof File) {
      formData.append('avatar', profileData.avatar);
    }

    const response = await fetch('http://localhost:3000/api/Profile/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser sets it automatically with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to update profile' };
    }

    const data = await response.json();
    console.log("Updated profile data:", data);
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

    const data = await response.json();

    // Prepend backend URL to avatar_url if it exists and is a relative path
    if (data.user && data.user.avatar_url && !data.user.avatar_url.startsWith('http')) {
      data.user.avatar_url = `http://localhost:3000/${data.user.avatar_url}`;
    }

    return data;
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