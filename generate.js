'use strict'

const { promisify } = require('util')
const { parse } = require('url')
const fs = require('fs')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const resolve = promisify(require('dns').resolve)
const geoip = require('geoip-lite')

;(async () => {
  const hosts = (await readFile('hosts.txt', 'utf8')).split('\n').filter(Boolean)

  const hostsWithIps = (await Promise.all(hosts.map(async (host) => {
    try {
      const hostname = parse(host).host
      const ips = await resolve(hostname)
      // for now, let's just use the first IP
      const ip = ips[0]
      const geo = geoip.lookup(ip)
      return {
        host,
        hostname,
        ip,
        geo
      }
    } catch (err) {
      console.error('%s: %s', host, (err && typeof err === 'object' && err.stack) ? err.stack : err)
      return undefined
    }
  }))).filter(Boolean)

  await writeFile('hosts.json', JSON.stringify(hostsWithIps, null, 2))

  console.log('Completed successfully')
})()
