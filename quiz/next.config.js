/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    BACKEND_URL: process.env.BACKEND_URL
  }
}

module.exports = nextConfig
