/**
 * Authentication utility functions
 * Handles user ID extraction from localStorage
 */

import { STORAGE_KEYS } from './constants';

/**
 * Get the current user ID from localStorage
 * The user object is stored after login as 'bb_user'
 * @throws {Error} If user is not authenticated or user ID is not found
 * @returns {number} The user ID
 */
export function getUserId(): number {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) {
    throw new Error('User not authenticated');
  }
  
  try {
    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error('User ID not found');
    }
    return user.id;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    throw new Error('Invalid user data');
  }
}

/**
 * Get user ID safely (returns null instead of throwing)
 * @returns {number | null} The user ID or null if not available
 */
export function getUserIdSafe(): number | null {
  try {
    return getUserId();
  } catch {
    return null;
  }
}
