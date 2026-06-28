import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '60m'

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN as any })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
