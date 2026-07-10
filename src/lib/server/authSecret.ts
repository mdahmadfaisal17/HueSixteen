const AUTH_SECRET_ERROR = "Missing NEXTAUTH_SECRET environment variable.";

export const getAuthSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error(AUTH_SECRET_ERROR);
  }

  return secret;
};
