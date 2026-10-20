/**
 * Smoke test for the production build.
 *
 * Serves `dist/` from a throwaway static server on a random free port, then
 * checks that the page is served, that every referenced asset resolves, and
 * that the bundle actually contains the application.
 *
 * The server runs inside this process rather than being spawned, so the test
 * can never leave an orphaned server behind or collide with a port that
 * something else is using.
 *
 * Exits non-zero on the first failure so it can gate a deploy.
 */

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(repoRoot, 'dist')

const EXPECTED_TITLE = 'Vellum'
const EXPECTED_MARKERS = ['Vellum', 'playground', 'WCAG', 'vellum-500']

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

/**
 * Starts a static file server on a free port.
 *
 * @param {string} root
 * @returns {Promise<{ server: import('node:http').Server, port: number }>}
 */
function startServer(root) {
  const server = createServer((request, response) => {
    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1')
    let pathname = decodeURIComponent(requestUrl.pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'

    const filePath = resolve(root, `.${pathname}`)

    // Never serve anything outside the build directory.
    if (!filePath.startsWith(root)) {
      response.writeHead(403).end('Forbidden')
      return
    }

    readFile(filePath)
      .then((body) => {
        response.writeHead(200, {
          'content-type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream',
        })
        response.end(body)
      })
      .catch(() => {
        response.writeHead(404).end('Not found')
      })
  })

  return new Promise((resolvePromise, rejectPromise) => {
    server.on('error', rejectPromise)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (address === null || typeof address === 'string') {
        rejectPromise(new Error('the server did not bind to a port'))
        return
      }
      resolvePromise({ server, port: address.port })
    })
  })
}

/**
 * @param {string} target
 * @param {number} port
 */
async function check(target, port) {
  const failures = []
  const base = `http://127.0.0.1:${port}/`

  const response = await fetch(base)
  if (!response.ok) {
    throw new Error(`${base} returned HTTP ${response.status}`)
  }

  const html = await response.text()

  if (!html.includes('<title>')) {
    failures.push('the served HTML has no <title> element')
  }
  if (!html.includes(EXPECTED_TITLE)) {
    failures.push(`the served HTML does not contain "${EXPECTED_TITLE}"`)
  }
  if (!html.includes('<script')) {
    failures.push('the served HTML has no script tag')
  }
  if (!html.includes('id="root"')) {
    failures.push('the served HTML has no #root element to mount into')
  }

  // The vanilla layer is a classic script and must be served separately.
  if (!html.includes('vanilla.js')) {
    failures.push('the served HTML does not reference the vanilla layer')
  }

  const assetPattern = /(?:src|href)="([^"]+\.(?:js|css|svg))"/g
  const assets = [...html.matchAll(assetPattern)].map((match) => match[1])

  if (assets.length === 0) {
    failures.push('the served HTML references no JavaScript or CSS assets')
  }

  for (const asset of assets) {
    const assetUrl = new URL(asset, base).href
    const assetResponse = await fetch(assetUrl)
    if (!assetResponse.ok) {
      failures.push(`asset ${asset} returned HTTP ${assetResponse.status}`)
      continue
    }
    if (asset.includes('vanilla')) {
      const source = await assetResponse.text()
      if (!source.includes('fd-counter')) {
        failures.push('the vanilla layer does not define the <fd-counter> element')
      }
    }
  }

  // The bundle must actually contain the application.
  const scriptAssets = assets.filter((asset) => asset.endsWith('.js') && !asset.includes('vanilla'))
  for (const scriptAsset of scriptAssets) {
    const scriptUrl = new URL(scriptAsset, base).href
    const scriptResponse = await fetch(scriptUrl)
    const code = await scriptResponse.text()

    if (code.length < 1000) {
      failures.push(`bundle ${scriptAsset} is suspiciously small (${code.length} bytes)`)
    }
    for (const marker of EXPECTED_MARKERS) {
      if (!code.includes(marker)) {
        failures.push(`bundle ${scriptAsset} does not contain the marker "${marker}"`)
      }
    }
  }

  return { assets: assets.length, failures }
}

let server = null
let exitCode = 0

try {
  const started = await startServer(distRoot)
  server = started.server

  const { assets, failures } = await check('index.html', started.port)

  if (failures.length > 0) {
    exitCode = 1
    console.error('\n✗ smoke test')
    for (const failure of failures) console.error(`    - ${failure}`)
  } else {
    console.log(`✓ smoke test — ${assets} assets verified on a static server`)
  }
} catch (error) {
  exitCode = 1
  console.error(`\n✗ smoke test failed: ${error instanceof Error ? error.message : String(error)}`)
} finally {
  if (server) server.close()
}

if (exitCode !== 0) {
  console.error('\n✗ smoke test failed')
  process.exit(exitCode)
}

console.log('\n✓ smoke test passed')
