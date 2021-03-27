import {makeAutoObservable} from 'mobx';
import User from '../backend/storage/User';
import functions from '@react-native-firebase/functions';

export class PartnerStore {
  user;
  gym;
  hasBankAccountAdded;
  constructor() {
    this.user = null;
    this.gym = null;
    this.hasBankAccountAdded = null;
    makeAutoObservable(this);
  }

  *getPartnerData() {
    const user = new User();
    const userDoc = yield user.retrieveUser();
    const gym = (yield user.retrievePartnerGyms()).map((it) => it.getAll())[0];

    if (gym) {
      const updateStripeAccountRevenue = functions().httpsCallable(
        'updateStripeAccountRevenue',
      );
      yield updateStripeAccountRevenue(gym.id);
    }
    this.user = userDoc;
    this.gym = gym;
    this.hasBankAccountAdded = Boolean(userDoc.stripe_bank_account_id);
  }
}
