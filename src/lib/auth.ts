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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }

      // On first sign-in via Google, the user object may not have 'role'
      // Fetch it from the database to ensure it's always correct
      if (token.id && !token.role) {
        try {
          const dbUsers = await db.select({ role: users.role }).from(users).where(eq(users.id, token.id as string));
          if (dbUsers[0]) {
            token.role = dbUsers[0].role || 'client';
          }
        } catch (e) {
          console.error('Error fetching user role for JWT:', e);
          token.role = 'client';
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
      }
      return session;
    },
  },
};
