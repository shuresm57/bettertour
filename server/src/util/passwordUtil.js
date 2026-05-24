import bcrypt from 'bcrypt';

const saltRounds = 14;

export async function hashPassword (password) {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
