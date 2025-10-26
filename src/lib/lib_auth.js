import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, account }) {
      // Guardar access token en el JWT
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Pasar access token a la sesión
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
    
    async signIn({ user, account, profile }) {
      // Aquí puedes agregar validación de usuarios permitidos
      // Por ejemplo, verificar si el email está en una lista de profesores
      
      // Por ahora permitimos todos los usuarios con Google
      return true;
      
      // Ejemplo de restricción por dominio:
      // const allowedDomain = 'tuescuela.edu.ar';
      // return user.email.endsWith(`@${allowedDomain}`);
    },
  },
  
  pages: {
    signIn: '/',  // Página de login personalizada
    error: '/auth/error',  // Página de error
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};