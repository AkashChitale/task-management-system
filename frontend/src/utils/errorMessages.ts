/**
 * Maps error codes and messages to user-friendly messages
 */
export function getUserFriendlyError(error: any): string {
  // Network errors
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;

  // HTTP status-based errors
  switch (status) {
    case 400:
      return message || "Invalid request. Please check your input.";
    case 401:
      return "Session expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return message || "This resource already exists.";
    case 422:
      return message || "Validation failed. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    default:
      return message || "An unexpected error occurred. Please try again.";
  }
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password requirements
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" };
  }
  return { valid: true };
}
