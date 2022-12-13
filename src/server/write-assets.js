// A webpack plugin to write webpack stats that can be consumed when rendering
// the page (e.g. it attach the public path to the script names)
// These stats basically contains the path of the script files to
// <script>-load in the browser.

// Inspired from http://webpack.github.io/docs/long-term-caching.html#get-filenames-from-stats

import fs from 'fs'
import path from 'path'

const getChunks = (publicPath, stats, name, ext) => {
  const json = stats.toJson()
  let chunk = json.assetsByChunkName[name]

  // a chunk could be a string or an array, so make sure it is an array
  if (!(Array.isArray(chunk))) chunk = [chunk]

  return chunk
    .filter(chunk2 => path.extname(chunk2) === `.${ext}`) // filter by extension
    .map(chunk2 => `${publicPath}${chunk2}`) // add public path to it
}

// Write only a relevant subset of the stats and attach the public path to it
const writeAssets = (compiler, assets) => {
  return (stats) => {
    const publicPath = compiler.options.output.publicPath
    const name = 'main'

    const content = {
      main: {
        css: getChunks(publicPath, stats, name, 'css'),
        js: getChunks(publicPath, stats, name, 'js'),
      },
    }

    return fs.writeFileSync(assets, JSON.stringify(content))
  }
}

const WriteAssetsPlugin = (assets) => ({
  apply: (compiler) => {
    compiler.hooks.done.tap('WriteAssetsPlugin', writeAssets(compiler, assets))
  }
})

export default WriteAssetsPlugin
