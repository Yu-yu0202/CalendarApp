import * as bcrypt from 'bcryptjs';
import {sign, verify} from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  isAdmin: boolean;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return verify(token, this.JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static generateToken(user: { id: string; isAdmin: boolean }): string {
    const payload: TokenPayload = {
      userId: user.id,
      isAdmin: user.isAdmin
    };
    return sign(payload, this.JWT_SECRET, { expiresIn: '1h' });
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('パスワード検証エラー:', error);
      throw error;
    }
  }
}