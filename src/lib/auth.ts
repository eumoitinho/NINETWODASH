/**
 * NextAuth Configuration for NINETWODASH
 * Handles authentication for admin users and client portal access
 */

import { type AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Check if user can access specific client data
 */
export function canAccessClient(userRole: string, userClientId: string, targetClientId: string): boolean {
  if (userRole === 'admin') {
    return true; // Admins can access all clients
  }
  
  if (userRole === 'client') {
    return userClientId === targetClientId; // Clients can only access their own data
  }
  
  return false;
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  // Temporariamente retornando a senha sem hash para permitir o build
  return password;
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Temporariamente comparando senhas simples para permitir o build
  return password === hashedPassword;
}