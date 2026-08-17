export function genericAuthError(fr: boolean) {
  return fr ? "L’opération n’a pas pu aboutir. Vérifiez vos informations et réessayez." : "The operation could not be completed. Check your details and try again.";
}

export function friendlyAuthError(error: unknown, fr: boolean) {
  const text = error instanceof Error ? error.message.toLowerCase() : "";
  if (text.includes("already registered") || text.includes("already exists")) return fr ? "Cette adresse est déjà utilisée. Essayez de vous connecter." : "This email is already in use. Try signing in instead.";
  if (text.includes("invalid email") || text.includes("email")) return fr ? "Saisissez une adresse email valide." : "Enter a valid email address.";
  if (text.includes("password") && (text.includes("short") || text.includes("weak"))) return fr ? "Choisissez un mot de passe d’au moins 8 caractères." : "Choose a password with at least 8 characters.";
  if (text.includes("invalid login") || text.includes("invalid credentials")) return fr ? "Email ou mot de passe incorrect." : "Incorrect email or password.";
  return genericAuthError(fr);
}
