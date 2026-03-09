import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apex_auto_default_secret';

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
}

export function signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
