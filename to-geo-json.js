'use strict'

const hosts = require('./hosts.json')
const { writeFileSync } = require('fs')

const geo = {
  type: 'FeatureCollection',
  features: hosts.map(h => ({
    type: 'Feature',
    properties: {
      name: h.host,
      ip: h.ip
    },
    geometry: {
      type: 'Point',
      coordinates: [ h.geo.ll[1], h.geo.ll[0] ]
    }
  }))
}

writeFileSync('hosts.geo.json', JSON.stringify(geo, null, 2))
