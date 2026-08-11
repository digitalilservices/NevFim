const ADMIN_EMAILS = new Set([
  "illypanferov15@gmail.com",
  "nevfim.grup@gmail.com",
]);

export function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.has(email.trim().toLowerCase()));
}
