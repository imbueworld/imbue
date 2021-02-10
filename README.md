# General

App is purely written in React Native.

For backend, in use is Firebase's Cloud Firestore and Realtime Databse. Realtime Database is only used for chat messages inside of Livestream view.

App depends on Firebase Cloud Functions, which are included in this repository. Cloud functions is the main and only way in which App accesses Stripe API or Mux API (which means that all tokens / secret keys for those are stored in cloud function config).

Financial features depend on Stripe.

Livestreaming features depend on Mux.