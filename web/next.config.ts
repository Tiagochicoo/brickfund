import type { NextConfig } from "next";

const pbHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8093");
  } catch {
    return new URL("http://127.0.0.1:8093");
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: pbHost.protocol.replace(":", "") as "http" | "https",
        hostname: pbHost.hostname,
        ...(pbHost.port ? { port: pbHost.port } : {}),
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "api.brick-fund.com",
        pathname: "/api/files/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8093",
        pathname: "/api/files/**",
      },
    ],
  },
  allowedDevOrigins: ["localhost", "127.0.0.1", "www.brick-fund.com", "brick-fund.com"],
};

export default nextConfig;
