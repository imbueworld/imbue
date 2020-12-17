import { Mixpanel } from 'mixpanel-react-native';


class Mixpanel extends React.Component {
    constructor(props) {
        super(props);
        this.configMixpanel();
    }

    configMixpanel = async () => {
        this.mixpanel = await Mixpanel.init("01ec862b39bd5fc6aff5745ad9914a97");
    }
  }


  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      mixpanel.people.set({
        "$email": user.email,    // only reserved properties need the $
        "Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
        "USER_ID": user.id,    // use human-readable names
      });

    }; init()
  }, [])

