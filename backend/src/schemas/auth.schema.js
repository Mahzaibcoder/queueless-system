// src/schemas/auth.schema.js - Simple validation helpers for auth

function validateRegister(data) {
  const errors = [];
  if (!data.name || !data.name.trim()) errors.push('Please enter your full name.');
  if (!data.email || !data.email.trim()) errors.push('Please enter a valid email address.');
  if (!data.password || data.password.length < 6) errors.push('Password must be at least 6 characters long.');
  if (!data.role || !['customer', 'owner'].includes(data.role)) errors.push('Role must be customer or owner.');
  return errors;
}

function validateLogin(data) {
  const errors = [];
  if (!data.email || !data.email.trim()) errors.push('Please enter your email address.');
  if (!data.password || !data.password.trim()) errors.push('Please enter your password.');
  return errors;
}

module.exports = { validateRegister, validateLogin };
