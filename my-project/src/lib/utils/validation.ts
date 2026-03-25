import { MIN_PASSWORD_LENGTH } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim())       return { valid: false, error: 'Email is required.' };
  if (!re.test(email))     return { valid: false, error: 'Enter a valid email address.' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password)                              return { valid: false, error: 'Password is required.' };
  if (password.length < MIN_PASSWORD_LENGTH)  return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  return { valid: true };
}

export function validateFullName(name: string): ValidationResult {
  if (!name.trim())              return { valid: false, error: 'Full name is required.' };
  if (name.trim().length < 3)    return { valid: false, error: 'Name must be at least 3 characters.' };
  if (!/\s/.test(name.trim()))   return { valid: false, error: 'Please enter your first and last name.' };
  return { valid: true };
}

export function validateScore(value: string, max: number): ValidationResult {
  const n = Number(value);
  if (value === '')          return { valid: false, error: 'Score is required.' };
  if (isNaN(n))              return { valid: false, error: 'Score must be a number.' };
  if (n < 0 || n > max)     return { valid: false, error: `Score must be between 0 and ${max}.` };
  return { valid: true };
}

export function validateFileType(file: File, accepted: string[]): ValidationResult {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!accepted.includes(ext)) return { valid: false, error: `File type not allowed. Accepted: ${accepted.join(', ')}` };
  return { valid: true };
}

export function validateFileSize(file: File, maxMb: number): ValidationResult {
  if (file.size > maxMb * 1_048_576) return { valid: false, error: `File must be under ${maxMb}MB.` };
  return { valid: true };
}

/** Password strength: returns label + tailwind width class */
export function passwordStrength(password: string): { label: string; color: string; width: string } | null {
  if (!password) return null;
  if (password.length < 6)                          return { label: 'Too short', color: 'bg-gray-300',    width: 'w-1/4' };
  if (password.length < 8 || !/[0-9]/.test(password)) return { label: 'Fair',     color: 'bg-amber-400',  width: 'w-2/4' };
  if (!/[A-Z]/.test(password))                      return { label: 'Good',     color: 'bg-emerald-400', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-emerald-600', width: 'w-full' };
}
