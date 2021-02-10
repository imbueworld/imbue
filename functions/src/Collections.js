const admin = require('firebase-admin')

exports.users = admin.firestore().collection('users')
exports.partners = admin.firestore().collection('partners')
exports.classes = admin.firestore().collection('classes')
exports.gyms = admin.firestore().collection('gyms')
//
exports.membership_instances = admin.firestore().collection('membership_instances')
exports.stripe_customers = admin.firestore().collection('stripe_customers')
exports.stripe_products = admin.firestore().collection('stripe_products')
exports.stripe_prices = admin.firestore().collection('stripe_prices')
//
exports.reports = admin.firestore().collection('reports')
