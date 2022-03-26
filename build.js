const options = {
  entryPoints: ['src/index.js'],
  // outdir: 'dist',
  outfile: 'dist/mdslides.js',
  bundle: true,
  loader: {
    '.png': 'base64',
    '.svg': 'base64',
    '.woff': 'file',
    '.ttf': 'file',
    '.woff2': 'file',
  }
};

if(process.env.mode === 'production') {
  require('esbuild').buildSync({minify: true, ...options});
} else {
  require('esbuild').serve({
    servedir: '.',
  }, options).then(server => {
    // Call "stop" on the web server to stop serving
    // server.stop();
    console.log(`Server is running at ${server.host}:${server.port}`);
  });
}