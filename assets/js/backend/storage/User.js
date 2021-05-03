import DataObject from './DataObject';
import ClassesCollection from './ClassesCollection';
import GymsCollection from './GymsCollection';
import cache from './cache';
import { Platform } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import { geocodeAddress, publicStorage } from '../BackendFunctions';
import {
  ClassAlreadyBoughtError,
  ClassAlreadyScheduledError,
  MembershipAlreadyBoughtError,
} from '../Errors';
import {
  handleAuthErrorAnonymous,
  handlePasswordResetError,
  requestPermissions,
} from '../HelperFunctions';
import ImagePicker from 'react-native-image-picker';
import Class from './Class';
import config from '../../../../App.config';
import Gym from './Gym';
import { add } from 'react-native-reanimated';
const p = console.log;

/**
 * All methods beginning with 'retrieve' are good to be used right after
 * instantiation. Any further methods created with retrieve must also start
 * with [ await this.init() ].
 *
 * To use any other methods, such as .mergeItems(), instance has to be init'ed
 * by [ await this.init() ].
 */
export default class User extends DataObject {
  constructor() {
    const firebaseUser = auth().currentUser;
    let collection = 'users';
    let accountType = 'user';

    // When instantiating the user could be signed in, could also not be
    if (firebaseUser) {
      const { displayName } = firebaseUser;
      // console.log('firebaseUser', firebaseUser) // DEBUG
      // console.log('displayName', displayName) // DEBUG
      if (displayName) {
        let idx = displayName.search('_');
        accountType = displayName.slice(0, idx);

        if (accountType == 'partner') collection = 'partners';
      }
    }

    super(collection);
    this.firebaseUser = firebaseUser;
    this.accountType = accountType;
  }

  /**
   * Makes sure that data is present:
   * either gets it from cache or server, then caching it.
   *
   * Populates data with extra fields,
   * as well as corrects it, if it is missing.
   * Does correcting calculations only once per session
   * (avoiding wasteful computation).
   */
  async init() {
    const { uid } = this.firebaseUser || {};
    if (uid === undefined) {
      return;
    }
    await this.initByUid(uid);
    // If data is missing (about user's uid) from database,
    // then assume the user has been deleted, and log out
    if (!this._getCacheObj().get()) {
      await auth().signOut();
      return;
    }

    const cacheObjPopulatedState = this._getCacheObj().ref(
      'fieldsArePopulated',
    );
    if (cacheObjPopulatedState.get()) return;

    const {
      first = '',
      last = '',
      icon_uri = 'imbueProfileLogoBlack.png',
      icon_uri_foreign = '',
      social_media = '',
      // For user:  These three should always be present as Arrays
      active_classes = [],
      active_memberships = [],
      scheduled_classes = [],
      // For partner:  These two should always be present as Arrays
      associated_classes = [],
      associated_gyms = [],
    } = this.getAll();

    // These should always be present
    if (this.accountType == 'partner') {
      this.mergeItems({
        associated_classes,
        associated_gyms,
      });
    } else {
      this.mergeItems({
        active_classes,
        active_memberships,
        scheduled_classes,
      });
    }

    // Merge common items
    this.mergeItems({
      first,
      last,
      name: `${first} ${last}`,
      icon_uri,
      icon_uri_foreign,
      social_media,
      icon_uri_full:
        (await publicStorage(uid)) ||
        icon_uri_foreign ||
        (await publicStorage(icon_uri)),
    });

    // Register this user in cache to have their fields been populated
    cacheObjPopulatedState.set(true);
  }

  /**
   * For creating a brand new account
   */
  async create(form, options) {
    return await this._BusyErrorWrapper('create', async () => {
      let {
        first,
        last,
        email,
        password,
        type,
        // for partner, specifically
        // company
        // company_address,
        // company_name,
        gym_description,
        social_media,
        // tax_id,
        // individual
        phone,
        dob,
        address,
        ssn_last_4,
      } = form;

      let account_type, uid, icon_uri_foreign;

      if (!options) {
        // Manual sign up
        account_type = type;

        let user;
        try {
          user = await auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
          console.log(error);
          return 'Email is taken.';
        }
        uid = user.user.uid;
        icon_uri_foreign = null;
      } else {
        // Sign up through socials
        const { accountType, user } = options;

        account_type = accountType;
        uid = user.uid;

        if (user.displayName) {
          let names = user.displayName.split(' ');
          first = names[0];
          last = names.slice(1).join(' ');
          email = user.email;
          icon_uri_foreign = user.photoURL;
        } else {
          let names = ['Example', 'Name'];
          first = names[0];
          last = names.slice(1).join(' ');
          email = user.email;
          icon_uri_foreign = user.photoURL;
        }
        // console.log(user.displayName)
        // console.log(JSON.stringify(user));
      }

      // Determine collection
      let collection;
      if (account_type == 'partner') collection = 'partners';
      else collection = 'users';

      // This is how we will know what type of account it is upon sign in
      let authPromise = auth().currentUser.updateProfile({
        displayName: `${account_type}_${first}_${last}`,
      });

      // Update instance of this object
      this.uid = uid;
      this.collection = collection;
      this.accountType = account_type;

      // Compile the document to push
      this.mergeItems({
        account_type,
        id: uid,
        first,
        last,
        email,
        icon_uri: 'imbueProfileLogoBlack.png',
        icon_uri_foreign,
      });

      // Add additional user-type-specific fields
      if (account_type == 'partner') {
        this.mergeItems({
          associated_classes: [],
          associated_gyms: [],
          revenue: 0,
          stream_key: null,
          playback_id: null,
          // below: primarily for stripe account creation purpose
          // company
          // company_address,
          // company_name,
          gym_description,
          social_media,
          // tax_id,
          // individual
          phone,
          dob,
          address,
          ssn_last_4,
        });
      } else {
        this.mergeItems({
          active_memberships: [],
          active_classes: [],
          scheduled_classes: [],
        });
      }

      // Send out requests
      await Promise.all([authPromise, this.push()]);
    });
  }

  /**
   * Permantently deletes user.
   */
  async delete() {
    await this.init();
    this._getCacheObj().set(undefined);
    await auth().currentUser.delete();
  }

  /**
   * Signs the user up for waitlist, or returns relevant infomration
   * about their position in it.
   */
  // async addToWaitlist(email, referrerToken) {
  //   await this.init()
  //   const add = functions().httpsCallable('addUserToWaitlist')
  //   const res = ( await add({ email, referrerToken }) ).data
  //   // delete res.total_waiters_currently // Since this information is being saved, this field would soon become irrelevant/inaccurate
  //   // await this._getWaitlistDbRef().set({
  //   //   ...res,
  //   //   referral_token: res.referral_link.split('=')[ 1 ],
  //   // })
  //   res.referral_token = res.referral_link.split('=')[ 1 ]
  //   this._getCacheObj().ref('waitlist').set(res)
  //   return res
  // }

  // async retrieveWaitlistStatus() {
  //   await this.init()
  //   const retrieveStatus = functions().httpsCallable('addUserToWaitlist') // Works also as a status retrieval function/endpoint
  //   let userStatus = this._getCacheObj().ref('waitlist').get()

  //   if (!userStatus) {
  //     const { email } = this.getAll()

  //     userStatus = ( await retrieveStatus({ email }) ).data
  //     userStatus.referral_token = userStatus.referral_link.split('=')[ 1 ]
  //     userStatus.waitlist_threshhold = (
  //       await firestore().collection('waitlist').doc('__GENERAL').get()
  //     ).data().waitlist_threshhold

  //     // Cache it
  //     this._getCacheObj().ref('waitlist').set(userStatus)
  //   }

  //   return userStatus
  // }

  /**
   * Main user data retrieval function
   */
  async retrieveUser() {
    await this.init();
    return this.getAll();
  }

  async retrievePaymentMethods() {
    await this.init();
    const cacheObj = cache(`${this.collection}/${this.uid}/payment_methods`);

    // If already cached => return that
    const data = cacheObj.get() || [];
    if (data.length) return data;

    // Retrieve from database
    const paymentMethods = (
      await this._getPaymentMethodsDbRef().get()
    ).docs.map((doc) => {
      // Scuffed, but only one that uses this extra
      // property is <CreditCardSelectionV2 />
      let data = doc.data();
      data.paymentMethodId = doc.id;
      return data;
    });

    // Cache it
    cacheObj.set(paymentMethods);

    return paymentMethods;
  }

  async retrievePastTransactions() {
    await this.init();
    const cacheObjPayments = cache(`${this.collection}/${this.uid}/payments`);
    const cacheObjSubs = cache(`${this.collection}/${this.uid}/subscriptions`);

    // If already cached => return that
    const paymentsAreCached = cacheObjPayments.get(); // undefined, if 404
    const subsAreCached = cacheObjSubs.get(); // undefined, if 404

    // Retrieve from database, where applicable
    if (!paymentsAreCached) {
      let payments = (await this._getPaymentsDbRef().get()).docs.map((doc) =>
        doc.data(),
      );

      // Cache it
      cacheObjPayments.set(payments);
    }
    if (!subsAreCached) {
      let subs = (await this._getSubsDbRef().get()).docs.map((doc) =>
        doc.data(),
      );

      // Cache it
      cacheObjSubs.set(subs);
    }

    // Return both types of transactions
    return [...(cacheObjPayments.get() || []), ...(cacheObjSubs.get() || [])];
  }

  /**
   * @returns {Array<Class>} An `Array` of backend `Class` objects
   */
  async retrieveClasses() {
    return await this._BusyErrorWrapper('retrieveClasses', async () => {
      await this.init();
      const collection = new ClassesCollection();
      const {
        // user
        active_classes = [],
        scheduled_classes = [],
        // partner
        associated_classes = [],
      } = this.getAll();

      let relevantClasses;
      if (this.accountType == 'partner') {
        relevantClasses = associated_classes;
      } else {
        // Extract the class_id from an Array of Objects containing class_id and time_id
        let classIdsActive = active_classes.map((it) => it.class_id);
        let classIdsScheduled = scheduled_classes.map((it) => it.class_id);
        // Combine and remove duplicates
        relevantClasses = [
          ...new Set([...classIdsActive, ...classIdsScheduled]),
        ];
      }

      // console.log("relevantClasses", relevantClasses) // DEBUG

      const classes = await collection.retrieveDocs(relevantClasses);
      return classes;
    });
  }

  /**
   * @returns {Array<Class>} An `Array` of backend `Class` objects
   */
  async retrieveScheduledClasses() {
    await this.init();
    const collection = new ClassesCollection();
    const { scheduled_classes = [] } = this.getAll();

    // Extract the class_id from an Array of Objects containing class_id and time_id
    let classIds = scheduled_classes.map((it) => it.class_id);
    const classes = await collection.retrieveWhere('id', 'in', classIds);
    return classes;
  }

  /**
   * Retrieves all associated_gyms of partner in the form of Gym objects list.
   */
  async retrievePartnerGyms() {
    await this.init();
    const collection = new GymsCollection();
    const { associated_gyms = [] } = this.getAll();

    if (this.accountType != 'partner') return;

    const gyms = await collection.retrieveWhere('id', 'in', associated_gyms);
    return gyms;
  }

  async addPaymentMethod(form) {
    await this.init();
    let { cardNumber, expMonth, expYear, cvc, cardHolderName, zip } = form;
    console.log(form);
    // Add the payment method through Google Cloud Function
    const addPaymentMethod = functions().httpsCallable('addPaymentMethod');
    const paymentMethod = (await addPaymentMethod(form)).data;

    // Update cache
    const cacheObj = cache(`${this.collection}/${this.uid}/payment_methods`);
    const data = cacheObj.get() || [];
    cacheObj.set([...data, paymentMethod]);
    return paymentMethod;
  }

  /**
   * One Time Class Purchase
   */
  async purchaseClass(details) {
    return await this._BusyErrorWrapper('purchaseClass', async () => {
      await this.init();

      let { paymentMethodId, classId, timeId } = details;

      // Charge user
      const makePurchase = functions().httpsCallable(
        'purchaseClassWithPaymentMethod',
      );
      // await makePurchase({ paymentMethodId, classId, timeId });

      // After successful charge, register it for user in their doc
      const { active_classes = [], scheduled_classes = [] } = this.getAll();
      let newEntry = { class_id: classId, time_id: timeId };
      this.mergeItems({
        active_classes: [...active_classes, newEntry],
        scheduled_classes: [...scheduled_classes, newEntry],
      });
      await this.push();
    });
  }

  /**
   * Free Class – Add to Calendar
   */
  async addClassToCalender(details) {
    await this.init();
    console.log('called');

    let { classId, timeId } = details;

    //get active_times and update relevant attendees
    let int = 0;
    let currentAttendees;
    let updatedActiveTimes = [];
    await firestore()
      .collection('classes')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          if (documentSnapshot.data().id == classId) {
            // map through active times
            documentSnapshot.data().active_times.forEach((clss) => {
              // update relevant attendees count
              if (clss.time_id == timeId) {
                clss.attendees += 1;
              }
              updatedActiveTimes.push(clss);
            });
          }
        });
      });

    // update active_times with new array (which has the updated attendees count)
    await firestore().collection('classes').doc(classId).update({
      active_times: updatedActiveTimes,
    });

    // After successful charge, register it for user in their doc
    const { active_classes = [], scheduled_classes = [] } = this.getAll();
    let newEntry = { class_id: classId, time_id: timeId };
    this.mergeItems({
      active_classes: [...active_classes, newEntry],
      scheduled_classes: [...scheduled_classes, newEntry],
    });
    await this.push();
  }

  /**
   * Schedules a class
   */
  async scheduleClass(details) {
    return await this._BusyErrorWrapper('scheduleClass', async () => {
      await this.init();

      let { classId, timeId } = details;

      // Validate that it hasn't, for whatever reason, already been scheduled.
      await this._forcePull();
      const { scheduled_classes = [] } = this.getAll();
      scheduled_classes.forEach(({ class_id, time_id }) => {
        if (class_id == classId && time_id == timeId)
          throw 'Class already scheduled.';
      });

      // [ Mindbody ]
      // Check whether it is a Mindbody class, and
      // if it is, try to sign up for it as a Mindbody Client.
      // If that fails, return
      const classObj = new Class();
      let { mindbody_integration } = await classObj.retrieveClass(classId);
      if (mindbody_integration) {
        const addClient = functions().httpsCallable('addMindbodyClientToClass');
        const { error } = (await addClient({ classId })).data || {};
        if (error) throw error;
      }

      // Add to schedule, push it to user doc,
      // and let the Google Cloud .onUpdate function do the rest.
      let newEntry = { class_id: classId, time_id: timeId };
      this.mergeItems({
        scheduled_classes: [...scheduled_classes, newEntry],
      });
      await this.push();
    });
  }

  /**
   * Unschedules a class
   */
  async unscheduleClass(details) {
    return await this._BusyErrorWrapper('unscheduleClass', async () => {
      await this.init();

      let { classId, timeId } = details;

      // Filter out of the list of scheduled classes
      const { scheduled_classes = [] } = this.getAll();
      const filteredClasses = scheduled_classes.filter(
        ({ class_id, time_id }) => {
          if (class_id == classId && time_id == timeId) return;
          return true;
        },
      );

      // Push new list to user doc,
      // and let the Google Cloud .onUpdate function do the rest.
      this.mergeItems({ scheduled_classes: filteredClasses });
      await this.push();

      // [ Mindbody ]
      // Unlike in .scheduleClass,
      // Try to unschedule from Mindbody database lastly,
      // because it is more important that local membership instances
      // get updated
      const classObj = new Class();
      let { mindbody_integration } = await classObj.retrieveClass(classId);
      if (mindbody_integration) {
        const removeClient = functions().httpsCallable(
          'removeMindbodyClientFromClass',
        );
        await removeClient({ classId });
      }
    });
  }

  /**
   * Purchases a Gym Online Membership from one of the gyms
   * using provided paymentMethodId.
   */
  async purchaseGymMembership(details) {
    return await this._BusyErrorWrapper('purchaseGymMembership', async () => {
      await this.init();

      let { user, paymentMethodId, gymId } = details;

      console.log('details: ', details);

      // Charge user
      const makePurchase = functions().httpsCallable('purchaseMembership');
      await makePurchase({ paymentMethodId, gymId });

      // After a successful charge, register the membership
      const { active_memberships = [] } = this.getAll();
      this.mergeItems({
        active_memberships: [...active_memberships, gymId],
      });
      await this.push();
    });
  }

  /**
   * Purchases the Imbue Universal Gym Membership.
   */
  async purchaseImbueMembership(details) {
    return await this._BusyErrorWrapper('purchaseImbueMembership', async () => {
      await this.init();

      let { paymentMethodId } = details;

      // Charge user
      const makePurchase = functions().httpsCallable('purchaseImbueMembership');
      await makePurchase({ paymentMethodId });

      // After a successful charge, register the membership
      const { active_memberships = [] } = this.getAll();
      this.mergeItems({
        active_memberships: [...active_memberships, 'imbue'],
      });
      await this.push();
    });
  }

  /**
   * Cancels a membership.
   */
  async cancelMembership(details) {
    return await this._BusyErrorWrapper('cancelMembership', async () => {
      await this.init();

      let { gymId } = details;

      // Cancel it
      const cancelMembership = functions().httpsCallable('cancelMembership');
      await cancelMembership({ gymId });

      // After successfully cancelling the membership, update user doc
      const { active_memberships = [] } = this.getAll();
      this.mergeItems({
        active_memberships: active_memberships.filter(
          (gym_id) => gym_id != gymId,
        ),
      });
      await this.push();
    });
  }

  /**
   * Creates livestream for user, assigns it to them,
   * if it hasn't already been created & assigned.
   */
  async createLivestream(details) {
    return await this._BusyErrorWrapper('createLivestream', async () => {
      await this.init();
      let { gymId } = details;
      const { stream_key } = this.getAll();

      if (stream_key) return stream_key;

      // Call Google Cloud Function, which creates LS & assigns it to user
      const createLivestream = functions().httpsCallable('createLivestream');
      await createLivestream({ gymId });

      // Attempt many times to get it from the field, because it may not be
      // there instantly, or in the worst case – at all
      for (let i = 0; i < 15; i++) {
        await this._forcePull();
        let { stream_key: streamKey } = this.getAll();

        if (streamKey) return streamKey;
        await new Promise((r) => setTimeout(r, 3500)); // sleep
      }
    });
  }

  changeIcon() {
    return new Promise(async (resolve, reject) => {
      await this.init();

      // Ascertain that all permissions have been granted
      if (Platform == 'android') {
        const unfulfilledPerms = await requestPermissions([
          'CAMERA',
          'READ_EXTERNAL_STORAGE',
        ]);
        if (unfulfilledPerms)
          reject('Missing permissions: ' + unfulfilledPerms.join(', '));
      }

      // Do the image stuff
      ImagePicker.showImagePicker({}, async (res) => {
        if (res.didCancel) {
          if (config.DEBUG)
            console.log('Photo selection canceled:', res.didCancel);
        }

        if (res.error) {
          if (config.DEBUG) console.error(res.error);
          reject('Something prevented the action.');
        }

        // Main portion

        // const {
        //   path: filePath,
        //   fileSize,
        // } = res
        console.log(res);
        const source = { uri: res.uri };

        console.log('source: ' + JSON.stringify(source));
        // console.log("uri: " + source)

        const { id: userId } = this.getAll();

        // 8MB of file size limit
        // if (fileSize > 8 * 1024 * 1024) {
        //   reject('Image file size must not exceed 8MB.')
        // }

        try {
          const fileRef = storage().ref(userId);
          // await fileRef.putFile(filePath)
          await fileRef.putFile(source.uri);

          this.mergeItems({
            icon_uri: userId,
            icon_uri_full: await publicStorage(userId, true),
          });

          // get gymId
          const userDocumentSnapshot = await firestore()
            .collection('partners')
            .doc(userId)
            .get();
          const gymId = userDocumentSnapshot.data().associated_gyms[0];
          console.log('gymId: ', gymId);

          // update game image_uri
          await firestore().collection('gyms').doc(gymId).update({
            image_uri: userId,
          });

          await this.push();
          resolve('Success.');
        } catch (err) {
          if (config.DEBUG) console.error(err);
          reject('Something prevented upload.');
          console.error(err);
        }
      });
    });
  }

  // changeClassPhoto(gym) {
  //   return new Promise(async (resolve, reject) => {

  //     // Ascertain that all permissions have been granted
  //     if (Platform == "android") {
  //       const unfulfilledPerms = await requestPermissions([
  //         'CAMERA',
  //         'READ_EXTERNAL_STORAGE',
  //       ])
  //       if (unfulfilledPerms) reject(
  //         'Missing permissions: '
  //         + unfulfilledPerms.join(', ')
  //       )
  //     }

  //     // Do the image stuff
  //     ImagePicker.showImagePicker({}, async res => {
  //       if (res.didCancel) {
  //         // ...
  //         if (config.DEBUG) console.log('Photo selection canceled:', res.didCancel)
  //       }

  //       if (res.error) {
  //         if (config.DEBUG) console.error(res.error)
  //         reject('Something prevented the action.')
  //       }

  //       // Main portion

  //       // const {
  //       //   path: filePath,
  //       //   fileSize,
  //       // } = res

  //       const source = { uri: res.uri };

  //       // console.log("uri: " + source)

  //       const id = gym.id
  //       const img = source.uri

  //       const id = Math.random().toString(36).substring(7);
  //       const img = source.uri

  //       // 8MB of file size limit
  //       // if (fileSize > 8 * 1024 * 1024) {
  //       //   reject('Image file size must not exceed 8MB.')
  //       // }

  //       //

  //       try {
  //         const fileRef = storage().ref(id)
  //         // await fileRef.putFile(filePath)
  //         await fileRef.putFile(source.uri)

  //         const url = await (await storage().ref(id).getDownloadURL()).toString()

  //         console.log("imgUser: " + url)

  //         return url;

  //         firestore()
  //           .collection('gyms').doc(id)
  //           .set({
  //             image_uri: url,
  //           }, { merge: true })

  //         // this.mergeItems({
  //         //   image_uris: id,
  //         // })

  //         // await this.push()

  //       } catch (err) {
  //         if (config.DEBUG) console.error(err)
  //         reject('Something prevented upload.')
  //         console.error(err)
  //       }

  //     })
  //   })
  // }

  async sendPasswordResetEmail(email) {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (err) {
      const userFacingErrMsg = handleAuthErrorAnonymous(err);
      throw userFacingErrMsg;
    }
  }

  async confirmPasswordReset(code, newPass) {
    try {
      await auth().confirmPasswordReset(code, newPass);
    } catch (err) {
      const userFacingErrMsg = handlePasswordResetError(err);
      throw userFacingErrMsg;
    }
  }

  /**
   * Partner Mindbody function to get the Activation Link & Code with.
   */
  async requestMindbodyActivation(details) {
    return await this._BusyErrorWrapper(
      'requestMindbodyActivation',
      async () => {
        let { siteId } = details;
        const requestActivation = functions().httpsCallable(
          'getMindbodyActivationCode',
        );
        return (await requestActivation(details)).data;
      },
    );
  }

  /**
   * Acts as a "compiler", or "packager", that turns a simple one layer provided
   * Object into the necessary object for Stripe API.
   * Updates according object, for which information has been provided,
   * can update both.
   * @see https://stripe.com/docs/api/accounts/update
   * @see https://stripe.com/docs/api/persons/update
   */
  async updateStripeAccount(details, prefetchedData) {
    await this.init();
    let {
      dob,
      email,
      address,
      formatted_address,
      phone,
      ssn_last_4,
      // company_address: companyAddressText,
      // company_name,
      // tax_id,
      // .. more can be incorporated
    } = details;

    let {
      pfGeocodeAddress,
      // pfGeocodeCompanyAddress,
    } = prefetchedData;

    let updateAccount, updatePerson; // If these become true, update according one, or both, ofc
    const accountFinalDocument = {
      individual: {},
    };
    const personFinalDocument = {};

    // Transform descriptive address strings into geolocation components
    //
    // if (companyAddressText) {
    //   const {
    //     address: company_address,
    //   } = pfGeocodeCompanyAddress || await geocodeAddress(companyAddressText) || {}
    //   if (config.DEBUG) p('company_address', company_address)
    //   // Do not continue, if provided address is invalid.
    //   if (!company_address)
    //     throw 'Provided company\'s address was not specific enough.'

    //   updateAccount = true
    //   accountFinalDocument.company.address = company_address
    // }
    //
    if (formatted_address) {
      const { address } =
        pfGeocodeAddress || (await geocodeAddress(formatted_address)) || {};
      if (config.DEBUG) p('address', address);
      // Do not continue, if provided address is invalid.
      if (!address)
        throw "Provided individual's address was not specific enough.";

      updatePerson = true;
      personFinalDocument.address = address;
    }

    // accountFinalDocument.company.name = company_name
    // accountFinalDocument.company.tax_id = tax_id
    // accountFinalDocument.company.phone = phone
    // if (company_name || tax_id || phone) updateAccount = true
    // if ( dob || address || phone) updateAccount = true

    accountFinalDocument.dob = dob;
    accountFinalDocument.phone = phone;
    accountFinalDocument.ssn_last_4 = ssn_last_4;
    accountFinalDocument.email = email;
    accountFinalDocument.address = address;
    accountFinalDocument.formatted_address = formatted_address;
    console.log('accountFinalDocument (yeet): ', accountFinalDocument);

    if (dob || ssn_last_4 || phone) updateAccount = true;

    if (updateAccount) {
      const updateAccount = functions().httpsCallable('updateStripeAccount');
      await updateAccount(accountFinalDocument);
    }
    if (updatePerson) {
      // const updatePerson = functions().httpsCallable('updateStripePerson')
      // await updatePerson(personFinalDocument)
    }
  }

  _getPaymentMethodsDbRef() {
    return firestore()
      .collection('stripe_customers')
      .doc(this.uid)
      .collection('payment_methods');
  }

  _getPaymentsDbRef() {
    return firestore()
      .collection('stripe_customers')
      .doc(this.uid)
      .collection('payments');
  }

  _getSubsDbRef() {
    return firestore()
      .collection('stripe_customers')
      .doc(this.uid)
      .collection('subscriptions');
  }

  // _getWaitlistDbRef() {
  //   return firestore()
  //     .collection('waitlist')
  //     .doc(this.uid)
  // }
}
