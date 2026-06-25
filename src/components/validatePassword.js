/**
 * Validate password
 * 
 * Requirements:
    * Minimum 8 characters
    * Uppercase letter
    * Lowercase letter
    * Number
    * Special character
    */
export default function validatePassword(password) {

    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    }
    if (!hasUpper) {
        return 'Password must include at least one uppercase letter.';
    }
    if (!hasLower) {
        return 'Password must include at least one lowercase letter.';
    }
    if (!hasNumber) {
        return 'Password must include at least one number.';
    }
    if (!hasSpecial) {
        return 'Password must include at least one special character.';
    }

    return null;
}