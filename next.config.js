module.exports = {
  images: {
    // Every distinct width the optimizer is asked for costs one full download
    // of the original from Blob, so this list is kept as short as the layout
    // allows. Nothing above 1920 is useful: the uploaded sources cap at 2048.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 256, 384],
    // Default is "attachment", which some link unfurlers refuse to render.
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};
