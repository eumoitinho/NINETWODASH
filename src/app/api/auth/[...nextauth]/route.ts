import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase, findUserByEmail } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          await connectToDatabase();
          
          const user = await findUserByEmail(credentials.email);
          if (!user) {
            throw new Error('Usuário não encontrado');
          }

          if (!user.isActive) {
            throw new Error('Conta desativada');
          }

          const isValidPassword = await verifyPassword(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Senha incorreta');
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          // Get client info if user is a client
          let clientSlug = null;
          if (user.role === 'client' && user.clientId) {
            const { Client } = await import('@/lib/mongodb');
            const client = await (Client as any).findById(user.clientId);
            clientSlug = client?.slug;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            clientId: user.clientId?.toString(),
            clientSlug,
            avatar: user.avatar,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Erro de autenticação');
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fazendo type assertion para acessar propriedades customizadas
        const customUser = user as { role?: string; clientId?: string; clientSlug?: string; avatar?: string };
        token.role = customUser.role;
        token.clientId = customUser.clientId;
        token.clientSlug = customUser.clientSlug;
        token.avatar = customUser.avatar;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).clientId = token.clientId;
        (session.user as any).clientSlug = token.clientSlug;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };