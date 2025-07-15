/**
 * NextAuth Configuration for NINETWODASH
 * Handles authentication for admin users and client portal access
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase, User, Client, logActivity } from './mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credenciais',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'seu@email.com'
        },
        password: {
          label: 'Senha',
          type: 'password'
        },
        userType: {
          label: 'Tipo de Usuário',
          type: 'text'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          await connectToDatabase();
          
          // Find user by email
          const user = await User.findOne({ 
            email: credentials.email,
            isActive: true 
          }).populate('clientId');

          if (!user) {
            throw new Error('Usuário não encontrado');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Senha inválida');
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

          // Log login activity
          await logActivity(
            user._id.toString(),
            'USER_LOGIN',
            `Login realizado por ${user.role}`,
            { email: user.email, userAgent: credentials.userType },
            user.clientId?._id?.toString()
          );

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            clientId: user.clientId?._id?.toString(),
            clientSlug: user.clientId?.slug,
            clientName: user.clientId?.name,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Erro de autenticação');
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId;
        token.clientSlug = user.clientSlug;
        token.clientName = user.clientName;
        token.avatar = user.avatar;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.clientId = token.clientId as string;
        session.user.clientSlug = token.clientSlug as string;
        session.user.clientName = token.clientName as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect based on user role
      const session = await import('next-auth/react').then(m => m.getSession());
      
      if (session?.user?.role === 'client') {
        return `${baseUrl}/portal/${session.user.clientSlug}`;
      }
      
      return `${baseUrl}/index-9`; // Admin dashboard
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Create a new user (admin only)
 */
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'client';
  clientId?: string;
}) {
  await connectToDatabase();
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Usuário já existe com este email');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  // Create user
  const user = new User({
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    role: userData.role,
    clientId: userData.clientId || null,
  });
  
  return await user.save();
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  await connectToDatabase();
  
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, updatedAt: new Date() },
    { new: true }
  );
}

/**
 * Create client portal user
 */
export async function createClientPortalUser(
  clientId: string,
  userData: {
    email: string;
    password: string;
    name: string;
  }
) {
  await connectToDatabase();
  
  // Verify client exists
  const client = await Client.findById(clientId);
  if (!client) {
    throw new Error('Cliente não encontrado');
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Usuário já existe com este email');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  // Create client user
  const user = new User({
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    role: 'client',
    clientId,
  });
  
  const savedUser = await user.save();
  
  // Log activity
  await logActivity(
    savedUser._id.toString(),
    'USER_CREATED',
    `Usuário criado para o cliente ${client.name}`,
    { email: userData.email },
    clientId
  );
  
  return savedUser;
}

/**
 * Middleware function to check user permissions
 */
export function requireAuth(requiredRole?: 'admin' | 'client') {
  return async (req: any, res: any, next: any) => {
    try {
      const session = await import('next-auth/react').then(m => m.getSession({ req }));
      
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Não autenticado' });
      }
      
      if (requiredRole && session.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Permissão insuficiente' });
      }
      
      req.user = session.user;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erro de autenticação' });
    }
  };
}

/**
 * Check if user can access client data
 */
export function canAccessClient(userRole: string, userClientId: string, targetClientId: string): boolean {
  // Admin can access all clients
  if (userRole === 'admin') {
    return true;
  }
  
  // Client can only access their own data
  if (userRole === 'client' && userClientId === targetClientId) {
    return true;
  }
  
  return false;
}

/**
 * Generate random password for client users
 */
export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Hash password utility
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Verify password utility
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}