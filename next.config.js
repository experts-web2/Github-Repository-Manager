/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PERSONAL_ACCESS_TOKEN: process.env.GREETING,
    REPO_OWNER: process.env.REPO_OWNER,
    REPO_NAME: process.env.REPO_NAME,
  },
};

module.exports = nextConfig;
