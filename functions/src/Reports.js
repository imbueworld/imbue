const admin = require('firebase-admin')
const {
  reports,
} = require('./Collections')



class Reports {
  constructor(dateString, collection, errorLimitBeforeThrow=0) {
    this.collection = collection
    this.dateString = dateString
    this.errorLimitBeforeThrow = errorLimitBeforeThrow || undefined
    this.errorsLogged = 0
  }

  async deleteLogs() {
    const batch = admin.firestore().batch()
    let x = (await reports
      .doc(this.dateString)
      .collection(this.collection)
      .get()
    ).docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
  }

  async log(uid, doc, forceThrow=false) {
    await reports
      .doc(this.dateString)
      .collection(this.collection)
      .doc(uid)
      .set(doc)
    if (forceThrow) throw doc['__message'] || `Error found and logged to reports/${this.dateString}/${this.collection}/${uid}.`
    this.errorsLogged++
    if (this.errorsLogged >= this.errorLimitBeforeThrow) throw `Error logging limit of ${this.errorLimitBeforeThrow} reached, throwing.`
  }
}

exports.Reports = Reports
