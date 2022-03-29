const options = {
  entryPoints: ['src/index.js'],
  // outdir: 'dist',
  outfile: 'dist/webslides.js',
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
  options.outfile = 'dist/webslides.js';
  require('esbuild').buildSync({minify: true, ...options});
} else if(process.env.mode === 'doc') {
  options.outfile = 'docs/static/webslides.js';
  require('esbuild').buildSync({minify: true, ...options});
} else {
  options.outfile = 'docs/static/webslides.js';
  require('esbuild').serve({
    servedir: 'docs',
  }, options).then(server => {
    // Call "stop" on the web server to stop serving
    // server.stop();
    console.log(`Server is running at ${server.host}:${server.port}`);
  });
}