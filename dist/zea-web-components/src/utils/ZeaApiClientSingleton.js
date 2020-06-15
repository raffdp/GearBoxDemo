import { ZeaApiBrowserClient } from '@zeainc/drive-lib'
// import { EventDispatcher } from '@zeainc/zea-svg-viewer'
import PouchDb from 'pouchdb-browser'
import PouchDbFind from 'pouchdb-find'

const API_CONFIG = {
  auth0: {
    audience: 'https://apistage.visualive.io/',
    domain: 'visualive-stage.auth0.com',
    clientID: 'cQmTLJau7Md9d6TXHAg2uPoX1yG9Oz9N',
    logoutUrl: 'https://visualive-stage.auth0.com/v2/logout',
  },
  apiUrl: 'https://api-staging.zea.live/api/v1/',
  socketUrl: 'https://websocket-staging.zea.live',
}

/**
 *
 */
class DbSingleton {
  /**
   *
   */
  static getInstances(dbName) {
    PouchDb.plugin(PouchDbFind)

    const localDB = new PouchDb(dbName)
    const remoteDB = new PouchDb('http://104.197.40.188:5984/' + dbName, {
      auth: {
        username: 'administrator',
        password: 'dp2MtqfP',
      },
    })

    localDB
      .sync(remoteDB, {
        live: true,
        retry: true,
      })
      .on('change', function (change) {
        console.log('Something changed:', change)
      })
      .on('error', function (err) {
        console.log('Error (maybe the user went offline?):', err)
      })
    return { localDB, remoteDB }
  }
}

/**
 *
 */
class ZeaApiClientSingleton {
  /**
   *
   */
  static getInstance() {
    if (this.instance) {
      return this.instance
    }

    const { localDB } = DbSingleton.getInstances('zea-inc')
    const zeaApiClient = new ZeaApiBrowserClient(localDB, API_CONFIG)

    this.instance = zeaApiClient

    return this.instance
  }
}

export { API_CONFIG, ZeaApiClientSingleton, DbSingleton }
