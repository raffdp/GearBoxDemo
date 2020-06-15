/* eslint-disable @typescript-eslint/camelcase */
import { GoogleCloudPlugin, ZeaApiBrowserClient } from '@zeainc/drive-lib'
import pouchDbBrowser from 'pouchdb-browser'

const loginRedirectUri = `${window.location.origin}/auth-callback`

const API_CONFIG = {
  auth0: {
    audience: 'https://couchdb.apache.org',
    client_id: 'CVanC502MtwSA5YEPLJUaygv8RsldgcA',
    domain: 'zea-development.auth0.com',
    login_redirect_uri: loginRedirectUri,
  },
  remoteDbHost: 'http://35.238.171.104:5984',
  socketUrl: 'https://websocket-staging.zea.live',
}

const zeaApiClient = new ZeaApiBrowserClient(pouchDbBrowser, API_CONFIG)

const googleCloudPluginUrl =
  'https://zea-google-cloud-plugin-ufiz5m76sa-uc.a.run.app/'
const googleCloudPlugin = new GoogleCloudPlugin(googleCloudPluginUrl)

zeaApiClient.setCloudStoragePlugin(googleCloudPlugin)

export default zeaApiClient
