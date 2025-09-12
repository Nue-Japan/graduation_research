/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 静的サイトとして出力する設定
  output: 'export',

  // 2. サブディレクトリを指定
  // 'ARDataPlatform'の部分は、ご自身のGitHubリポジトリ名に変更してください
  basePath: '/ARDataPlatform',

  // 3. 静的エクスポートで画像を表示するための設定
  images: {
    unoptimized: true,
  },
};

export default nextConfig;