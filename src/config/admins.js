// Add any email address here to grant admin access.
// In a real app this would live in a database / Firebase custom claims.
export const ADMIN_EMAILS = [
  'sakib08.dev@gmail.com',
];

export const isAdmin = (user) =>
  !!user && ADMIN_EMAILS.includes(user.email?.toLowerCase());
