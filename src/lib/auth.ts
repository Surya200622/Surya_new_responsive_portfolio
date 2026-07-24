import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // @ts-ignore - The adapter types might have a slight mismatch, but this works at runtime
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt', // We need JWT for CredentialsProvider
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const userResults = await db.select().from(users).where(eq(users.email, credentials.email));
        const user = userResults[0];

        if (!user || !user.password) {
          throw new Error('User not found or uses social login');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Automatically sync Google profile picture if the user's DB image is null
      if (account?.provider === 'google' && user?.image) {
        try {
          const existingUser = await db.select({ image: users.image }).from(users).where(eq(users.email, user.email as string));
          
          if (existingUser.length > 0 && !existingUser[0].image) {
            await db.update(users).set({ image: user.image }).where(eq(users.email, user.email as string));
          }
        } catch (error) {
          console.error('Error syncing Google profile picture:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.picture = user.image || token.picture;
      }

      // Ensure we have the latest role and image from the DB
      if (token.id) {
        try {
          const dbUsers = await db.select({ role: users.role, image: users.image }).from(users).where(eq(users.id, token.id as string));
          if (dbUsers[0]) {
            token.role = dbUsers[0].role || 'client';
            token.picture = dbUsers[0].image || token.picture;
          }
        } catch (e) {
          console.error('Error fetching user data for JWT:', e);
          if (!token.role) token.role = 'client';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = (token.role as string) || 'client';
        // @ts-ignore
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
};
