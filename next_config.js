/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración de variables de entorno
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Configuración de imágenes (si necesitas cargar fotos de perfil de Google)
  images: {
    domains: ['lh3.googleusercontent.com'],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;