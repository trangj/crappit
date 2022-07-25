module.exports = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    loader: 'imgix',
    path: process.env.NEXT_PUBLIC_IMAGE_LOADER_URL,
  },
};
