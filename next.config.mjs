/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        const isProduction = process.env.NODE_ENV === 'production'
        const csp = [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https:",
            "style-src 'self' 'unsafe-inline' https:",
            isProduction
                ? "script-src 'self' 'unsafe-inline' https:"
                : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
            isProduction
                ? "connect-src 'self' https:"
                : "connect-src 'self' https: ws: wss:",
            "worker-src 'self' blob:",
            "object-src 'none'",
            ...(isProduction ? ["upgrade-insecure-requests"] : []),
        ].join('; ')

        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Content-Security-Policy', value: csp },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ]
    },
}

export default nextConfig
