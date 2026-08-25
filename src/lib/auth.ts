import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

const adapter = DrizzleAdapter(db) as any;

export const authOptions: NextAuthOptions = {
  // @ts-ignore - The adapter types might have a slight mismatch, but this works at runtime
  adapter: {
    ...adapter,
    createUser: async (user: any) => {
      user.createdAt = new Date();
      return adapter.createUser(user);
    }
  },
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
      async authorize(credentials, req) {
        const ip = getIp(req);
        const rateLimit = checkRateLimit(ip, 'login', 5, 5 * 60 * 1000); // 5 attempts per 5 minutes
        
        if (!rateLimit.success) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const userResults = await db.select().from(users).where(eq(users.email, credentials.email));
        let user = userResults[0];

        // Admin Secret Code Enforcement
        if (credentials.email === 'cssurya2006@gmail.com') {
          if (credentials.password !== (process.env.ADMIN_SECRET || 'SURYA_ADMIN_SECURE')) {
             throw new Error('Invalid Admin Secret Key. You must use the secret code to login.');
          }
          if (!user) {
            const newId = crypto.randomUUID();
            await db.insert(users).values({
              id: newId,
              email: credentials.email,
              name: 'Surya CS',
              role: 'admin',
              createdAt: new Date(),
            } as any);
            user = { id: newId, email: credentials.email, name: 'Surya CS', role: 'admin' } as any;
          } else if (user.role !== 'admin') {
            await db.update(users).set({ role: 'admin' }).where(eq(users.email, credentials.email));
            user.role = 'admin';
          }
          return { id: user.id, email: user.email, name: user.name, role: 'admin' };
        }

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
      // Automatically sync Google profile picture if the user's DB image is null and auto-assign admin role
      if (account?.provider === 'google') {
        try {
          const existingUser = await db.select({ image: users.image, role: users.role }).from(users).where(eq(users.email, user.email as string));
          
          if (existingUser.length > 0) {
            const updateData: any = {};
            if (user.image && !existingUser[0].image) {
              updateData.image = user.image;
            }
            // Auto-assign admin role
            if (user.email === 'cssurya2006@gmail.com' && existingUser[0].role !== 'admin') {
              updateData.role = 'admin';
            }

            if (Object.keys(updateData).length > 0) {
              await db.update(users).set(updateData).where(eq(users.email, user.email as string));
            }
          }
        } catch (error) {
          console.error('Error in Google signIn callback:', error);
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
