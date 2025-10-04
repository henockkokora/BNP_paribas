/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supprimer output: 'export' pour Render
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com'] // Ajouter les domaines d'images externes
  },
  // Configuration pour Render
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
