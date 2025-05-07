/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable Cypress component testing compatibility
  webpack: (config) => {
    // This is needed for Cypress component testing with Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any aliases needed for your project
    }
    
    return config
  }
}

module.exports = nextConfig
