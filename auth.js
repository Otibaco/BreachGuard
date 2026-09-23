import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/connectDB';
import { User } from '@/models/User';
import { getClientIp, hashValue, normalizeEmail } from '@/lib/utils';
import { logSecurityEvent } from '@/controllers/securityEventController';

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = normalizeEmail(credentials?.email ?? '');
        const password = String(credentials?.password ?? '');
        const ipHash = hashValue(getClientIp(req?.headers ?? {}));

        if (!email || !password) {
          await logSecurityEvent({
            type: 'failed_admin_login',
            ipHash,
            metadata: { reason: 'missing_credentials' },
          });
          return null;
        }

        await connectDB();
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          await logSecurityEvent({
            type: 'failed_admin_login',
            ipHash,
            metadata: { reason: 'unknown_email', email },
          });
          return null;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          await logSecurityEvent({
            type: 'failed_admin_login',
            ipHash,
            metadata: { reason: 'invalid_password', email },
          });
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/control-center/login',
  },
  secret: process.env.AUTH_SECRET,
};
