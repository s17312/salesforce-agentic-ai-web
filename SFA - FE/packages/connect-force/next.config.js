const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  output: "standalone",
  /*
   * FIX:
   * {
   *   errno: -4048,
   *   code: 'EPERM',
   *   syscall: 'scandir',
   *   path: 'C:\\Users\\sgcol\\Cookies'
   * }*/
  outputFileTracing: false,
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      }
    ]
  },
}
 
module.exports = withBundleAnalyzer(nextConfig)
module.exports = nextConfig
