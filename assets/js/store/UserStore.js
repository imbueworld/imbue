import {makeAutoObservable} from 'mobx';
import User from '../backend/storage/User';
import functions from '@react-native-firebase/functions';

export class UserStore {
  classes;
  constructor() {
    this.classes = null;
    makeAutoObservable(this);
  }

  *getUserClasses() {
    this.classes = null;
    const user = new User();
    const fireUser = yield user.retrieveUser();

    const classStuff = (yield user.retrieveScheduledClasses()).map((it) => {
      let data = it.getFormatted();
      let activeDateForUser = [];
      data.active_times.forEach((time) => {
        if (fireUser.active_classes.some((el) => el.time_id === time.time_id))
          activeDateForUser.push(time);
      });
      data.active_times = activeDateForUser;
      return data;
    });

    this.classes = classStuff;
  }
}
