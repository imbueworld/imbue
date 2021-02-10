/**
 * There are currently some Stripe functions that are in index.js instead...
 */

const {
  PLAID_CLIENT_ID,
  PLAID_SECRET_SANDBOX,
  PLAID_SECRET_DEVELOPMENT,
  APP_NAME,
} = require('../CONFIG')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().stripe.secret, {
  apiVersion: '2020-03-02',
})
const plaidLib = require('plaid')
const plaid = new plaidLib.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET_DEVELOPMENT,
  env: plaidLib.environments.development,
})
const {
  partners,
} = require('../Collections')



/**
 * @see https://stripe.com/docs/api/external_account_bank_accounts/create
 */
exports.linkBankAccountToStripeAccount = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    external_account,
    routing_number,
    account_number,
  } = data
  const COUNTRY = 'us'
  const CURRENCY = 'usd'

  // Retrieve partner's Stripe Connect Account ID
  const { stripe_account_id } = ( await partners.doc(uid).get() ).data()

  // If property external_account is provided in fn call, assume it is a btok (token),
  // and use that, otherwise use information to construct a new dictionary.
  external_account = external_account && typeof external_account == 'string'
    ? external_account
    : {
      object: 'bank_account',
      country: COUNTRY,
      currency: CURRENCY,
      routing_number,
      account_number,
    }

  const bankAccount = await stripe.accounts.createExternalAccount(
    stripe_account_id,
    {
      external_account,
    }
  )

  // Save the id of the newly added bank account to partner's doc
  await partners.doc(uid).update({
    stripe_bank_account_id: bankAccount.id,
  })

  return bankAccount.id
})

/**
 * @see https://plaid.com/docs/api/tokens/#linktokencreate
 */
exports.getPlaidLinkToken = functions.https.onCall(async (data, context) => { 
  const { auth: { uid } } = context

  const tokenResponse = await plaid.createLinkToken({ 
    user: {
      client_user_id: uid,
    },
    client_name: APP_NAME,
    products: ['auth'], // 'transactions' might be needed, but might also not
    country_codes: ['US'],
    language: 'en',
  })

  return tokenResponse.link_token
})

/**
 * Connects based on currently logged in partner.
 */
exports.connectPlaidAccountToStripeSeller = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    public_token,
    plaid_account_id,
  } = data

  console.log("public_token: ", public_token)
  console.log("plaid_account_id: ", plaid_account_id)


  // Retrieve partner's Stripe Connect Account ID
  const { stripe_account_id } = ( await partners.doc(uid).get() ).data()
  // Exchange the received public token for an access token
  const { access_token } = await plaid.exchangePublicToken(public_token)
  console.log("access_token: ", access_token)

  // Generate a Stripe btok (bank token)
  const {
    stripe_bank_account_token: external_account,
  } = await plaid.createStripeToken( 
    access_token,
    plaid_account_id,
  )
  
  console.log("stripe_account_id: ", stripe_account_id)

  // Link the btok (bank token) to partner's Stripe Connect Account
  const bankAccount = await stripe.accounts.createExternalAccount(
    stripe_account_id,
    {
      external_account,
    }
  )

  // Save the id of the newly added bank account to partner's doc,
  // as well as the Plaid access_token
  await partners.doc(uid).update({
    stripe_bank_account_id: bankAccount.id,
    plaid_access_token: access_token,
  })
})
