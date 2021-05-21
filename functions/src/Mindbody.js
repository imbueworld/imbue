const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const { p } = require('./HelperFunctions')



class Mindbody {
  constructor(test=false) {
    if (typeof test != 'boolean') throw 'ValueError'

    this.test = test
    this.headers = {
      'Content-Type': 'application/json',
      'Api-Key': 'aa6f448d444544d08210be3156f33d5d',
      'SiteId': '',
      'Authorization': '', // formatted as: `Bearer {userToken}`
    }
    this._version = '6'
    this.base = 'https://api.mindbodyonline.com'
    this.endpoints = {
      'GET ActivationCode': `/public/v${this._version}/site/activationcode`,
      'POST UserToken': `/public/v${this._version}/usertoken/issue`,
      'GET RequiredClientFields': `/public/v${this._version}/client/requiredclientfields`,
      'GET Classes': `/public/v${this._version}/class/classes`,
      'GET ClassDescriptions': `/public/v${this._version}/class/classdescriptions`,
      'GET ClassSchedules': `/public/v${this._version}/class/classschedules`,
      'GET ClassVisits': `/public/v${this._version}/class/classvisits`,
      'POST AddClient': `/public/v${this._version}/client/addclient`,
      'GET Clients': `/public/v${this._version}/client/clients`,
      'POST AddClientToClass': `/public/v${this._version}/class/addclienttoclass`,
      'POST RemoveClientFromClass': `/public/v${this._version}/class/removeclientfromclass`,
    }
    this.sourceCredentials = {
      user: '_Imbue',
      pass: 'blahblah',
    }
  }

  setRequestHeader(name, value) {
    this.headers[ name ] = value
  }

  setUserToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  async getActivationCode() {
    const res = JSON.parse( await this._GET('ActivationCode') )
    if (res.Error) throw res.Error
    return res
  }

  async generateUserToken(user, pass) {
    if (!user || !pass) throw 'Insufficient params.'

    const res = await this._POST('UserToken', {
      Username: user,
      Password: pass,
    })

    const { AccessToken='', Error } = JSON.parse(res) || {}
    if (Error) throw Error

    this.headers['Authorization'] = `Bearer ${AccessToken}`
    return AccessToken
  }

  async useSourceCredentials() {
    const res = await this._POST('UserToken', {
      Username: this.sourceCredentials.user,
      Password: this.sourceCredentials.pass,
    })

    const { AccessToken='', Error } = JSON.parse(res) || {}
    if (Error) throw Error

    this.headers['Authorization'] = `Bearer ${AccessToken}`
    return AccessToken
  }

  async retrieveRequiredClientFields() {
    const res = await this._GET('RequiredClientFields')
    const { RequiredClientFields=[], Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return RequiredClientFields
  }

  async retrieveClasses(query) {
    const res = await this._GET('Classes', query)
    const { Classes=[], Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return Classes
  }

  async retrieveClassDescriptions(query) {
    const { Error, ...res } = await this._GET('ClassDescriptions', query)
    if (Error) throw Error
    return res
    // p('retrieveClassDescriptions', JSON.parse(res)) // DEBUG
  }

  async retrieveClassSchedules(query) {
    const { Error, ...res } = await this._GET('ClassSchedules', query)
    if (Error) throw Error
    return res
    // p('retrieveClassSchedules', JSON.parse(res)) // DEBUG
  }

  async retrieveClassVisits(query) {
    ['ClassId'].forEach(key => {
      if (!Object.keys(query).includes(key)) throw 'Insufficient params.'
    })

    const res = await this._GET('ClassVisits', query)
    const { Class={}, Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return Class
  }

  async retrieveClients(query) {
    const res = await this._GET('Clients', query)
    const { Clients=[], Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return Clients
  }

  async addClient(payload) {
    ['FirstName', 'LastName'].forEach(key => {
      if (!Object.keys(payload).includes(key)) throw 'Insufficient params.'
    })

    const res = await this._POST('AddClient', {
      Action: 'Added',
      ...payload,
    })

    const { Client=[], Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return Client
  }

  async addClientToClass(payload) {
    ['ClientId', 'ClassId'].forEach(key => {
      if (!Object.keys(payload).includes(key)) throw 'Insufficient params.'
    })

    const res = await this._POST('AddClientToClass', payload)
    const { Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return res
  }

  async removeClientFromClass(payload) {
    ['ClientId', 'ClassId'].forEach(key => {
      if (!Object.keys(payload).includes(key)) throw 'Insufficient params.'
    })

    const res = await this._POST('RemoveClientFromClass', payload)
    const { Error } = JSON.parse(res) || {}
    if (Error) throw Error
    return res
  }

  _checkRequiredParams(endpointName) {
    let allGood = true

    switch (endpointName) {
      case 'ActivationCode':
        break
      case 'UserToken':
        if (!this.headers['SiteId']) allGood = false
        break
      default:
        if (!this.headers['SiteId']) allGood = false
        if (!this.headers['Authorization']) allGood = false
        break
    }

    if (!allGood) throw 'Authorization was not set.'
  }

  _setHeaders(xhr) {
    for (let [header, value] of Object.entries(this.headers)) {
      xhr.setRequestHeader(header, value)
    }
  }

  _POST(endpointName, payload) {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.responseText)
      xhr.open('POST', `${this.base}${this.endpoints[`POST ${endpointName}`]}`)
      this._checkRequiredParams(endpointName)
      this._setHeaders(xhr)
      // Make sure to add Test parameter to payloaf,
      // if instance is in test mode
      xhr.send(JSON.stringify({
        ...payload,
        Test: this.test,
      }))
    })
  }

  _GET(endpointName, queryJSON={}) {
    return new Promise(resolve => {
      let query = Object.entries(queryJSON).map(([key, val]) => `${key}=${val}`).join('&')

      let xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.responseText)
      xhr.open('GET', `${this.base}${this.endpoints[`GET ${endpointName}`]}?${query}`)
      this._checkRequiredParams(endpointName)
      this._setHeaders(xhr)
      xhr.send()
    })
  }
}

exports.Mindbody = Mindbody
