import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
          isActive: true,
        }).select('+password');

        if (!user) return null;

        const isValid = await user.comparePassword(credentials.password as string);
        if (!isValid) return null;

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

