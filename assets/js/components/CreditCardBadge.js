import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {imageSourceFromCCBrand} from '../backend/HelperFunctions';
import Icon from './Icon';
import {colors} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * props
 *  .data -- { brand, last4, exp_month, exp_year }
 */
export default function CreditCardBadge(props) {
  let CC = props.data;
  let source = imageSourceFromCCBrand(CC.brand);
  const user = props.user;
  const id = props.paymentMethodId;

  const removeCard = async () => {
    await firestore()
      .collection('stripe_customers')
      .doc(user.id)
      .collection('payment_methods')
      .doc(id)
      .delete()
      .then(() => {
        props.onRemove();
      });
  };

  return (
    <View style={[styles.creditCardContainer]}>
      <Icon source={source} />
      <Text numberOfLines={1} style={styles.creditCardText}>
        {`•••• ${CC.last4} | ${CC.exp_month}/${CC.exp_year}`}
      </Text>
      <TouchableOpacity
        onPress={() => {
          removeCard();
        }}>
        <Icon
          containerStyle={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            marginLeft: 8,
            width: 25,
            height: 25,
          }}
          source={require('./img/png/x.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  creditCardContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    borderWidth: 1,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    borderRadius: 30,
    marginTop: 9, // 19
    marginBottom: 1,
    padding: 20,
  },
  creditCardText: {
    marginLeft: 10,
    alignSelf: 'center',
    ...FONTS.subtitle,
    color: colors.buttonFill,
    fontSize: 16,
    paddingBottom: 7,
  },
});
