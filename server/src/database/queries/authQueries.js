import db from '../connection.js';

export function setExpiryTokenByEmail (token, expiry, email) {
  return db.prepare(`
    UPDATE user
    SET reset_token = ?, 
    reset_token_expiry = ? 
    WHERE email = ?
    `).run(token, expiry, email);
}

export function findUserByToken (token, date) {
  return db.prepare(`
    SELECT * FROM user
    WHERE reset_token = ? AND reset_token_expiry > ?
    `).get(token, date);
}

export function updateUserAndToken (hashed, id) {
  return db.prepare(`
    UPDATE user
    SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL 
    WHERE user_id = ?
    `).run(hashed, id);
}
