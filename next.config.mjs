/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir o uso de cookies e autenticação
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // Configuração para otimização de imagens
  images: {
    domains: [],
  },
};

export default nextConfig;
