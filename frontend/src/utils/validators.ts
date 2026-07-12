import type { LoginCredentials, RegisterPayload, ValidationErrors } from '../types';

// Client-side validation that mirrors the backend request rules
// (App\Http\Requests\LoginValidator / RegistrationValidator). Messages are kept
// in sync with the backend so the user sees a consistent experience whether an
// error is caught here or returned from the API.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string): string | null => {
  const value = email.trim();
  if (!value) return 'Email is required';
  if (!EMAIL_RE.test(value)) return 'Email must be a valid email address';
  if (value.length > 255) return 'Email must be at most 255 characters long';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (password.length > 16) return 'Password must be at most 16 characters long';
  return null;
};

const validateName = (label: string, value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required`;
  if (trimmed.length < 3) return `${label} must be at least 3 characters long`;
  if (trimmed.length > 255) return `${label} must be at most 255 characters long`;
  return null;
};

/** Wrap single messages in the `string[]` shape the API + UI expect. */
const collect = (fields: Record<string, string | null>): ValidationErrors => {
  const errors: ValidationErrors = {};
  for (const [field, message] of Object.entries(fields)) {
    if (message) errors[field] = [message];
  }
  return errors;
};

export const validateLogin = (form: LoginCredentials): ValidationErrors =>
  collect({
    email: validateEmail(form.email),
    password: validatePassword(form.password),
  });

export const validateRegister = (form: RegisterPayload): ValidationErrors =>
  collect({
    first_name: validateName('First name', form.first_name),
    last_name: validateName('Last name', form.last_name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirm_password: !form.confirm_password
      ? 'Confirm password is required'
      : form.confirm_password !== form.password
        ? 'Confirm password must match password'
        : null,
  });
