const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = {
    ...withBundleAnalyzer(
        withPWA({
            pwa: {
                dest: 'public',
                runtimeCaching,
                disable: process.env.NODE_ENV === 'development',
            },
            images: {
                domains: ['assets.sushi.com', 'res.cloudinary.com', 'raw.githubusercontent.com', 'logos.covalenthq.com', 'cloudflare-ipfs.com', 'assets.coingecko.com'],
            },
            reactStrictMode: true
        }),
    ),
    webpack(config) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        return config;
    },
    images: {
        domains: ['assets.sushi.com', 'res.cloudinary.com', 'raw.githubusercontent.com', 'logos.covalenthq.com', 'cloudflare-ipfs.com', 'assets.coingecko.com'],
    },
}
