const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest



class Mindbody {
  constructor(test=false) {
    if (typeof test != 'boolean') throw 'ValueError'
    this.test = test
    this.headers = {
      'Content-Type': 'application/json',
      'Api-Key': 'a6b853fb0285405f9365de36fc8becd2',
      'SiteId': '',
      'Username': '',
      'Password': '',
    }
    this.base = 'https://api.mindbodyonline.com'
    this.UserTokenPOSTEndpoint = '/public/v6/usertoken/issue'
  }

  setAuthentication(siteId, user, pass) {
    this.headers['SiteId'] = siteId
    // this.headers['Username'] = user
    // this.headers['Password'] = pass
  }

  async retrieveUserToken(user, pass) {
    if (!user || !pass) throw 'Insufficient params.'

    return await this._POST(this.UserTokenPOSTEndpoint, {
      Username: user,
      Password: pass,
    })
  }

  _checkAuthorization() {
    let allGood = true
    if (!this.headers['SiteId']) allGood = false
    // if (!this.headers['Username']) allGood = false
    // if (!this.headers['Password']) allGood = false
    if (!allGood) throw 'Authentication was not set.'
  }

  _setHeaders(xhr) {
    for (let [header, value] of Object.entries(this.headers)) {
      xhr.setRequestHeader(header, value)
    }
  }

  _POST(endpoint, payload) {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)
      xhr.open('POST', `${this.base}${endpoint}`)
      this._checkAuthorization()
      this._setHeaders(xhr)
      // Make sure to add Test parameter to payloaf,
      // if instance is in test mode
      xhr.send(JSON.stringify({
        ...payload,
        Test: this.test,
      }))
    })
  }

  _GET(endpoint) {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)
      xhr.open('GET', `${this.base}${endpoint}`)
      this._checkAuthorization()
      this._setHeaders(xhr)
      xhr.send()
    })
  }
}

exports.Mindbody = Mindbody