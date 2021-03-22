import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {FONTS} from '../contexts/Styles';
import ClockInputPopup from './ClockInputPopup';
import ClockInputPopupField from './ClockInputPopupField';

export default function ClockInput(props) {
  let width = 60;
  let height = 60;
  if (props.style) {
    if (props.style.width) width = props.style.width;
    if (props.style.height) height = props.style.height;
  }

  const [Hours, HoursCreate] = useState(null);
  const [Minutes, MinutesCreate] = useState(null);

  const [popup, setPopup] = useState(false);

  const [h, setH] = useState(0);
  const [m, setM] = useState(0);

  // let popupWidth = width
  // let popupHeight = 216 // for now, just triple the height

  useEffect(() => {
    let hours = [];
    for (let i = -1; i <= 1 + 23; i++) {
      hours.push(
        <ClockInputPopupField
          width={width}
          height={width}
          style={{
            opacity: i === -1 || i === 24 ? 0 : 1,
            ...FONTS.body,
          }}
          key={`h${i}`}
          // onPress={() => {
          //     setH(i)
          //     // setPopup(false)
          //     // props.onClose()
          // }}
        >
          {i}
        </ClockInputPopupField>,
      );
    }
    HoursCreate(hours);

    let minutes = [];
    for (let i = -1; i <= 60 + 1; i++) {
      let item = i - 3;
      item = `${i}`.length > 1 ? i : `0${i}`;
      minutes.push(
        <ClockInputPopupField
          width={width}
          height={width}
          style={{
            // for the offset that is apparently needed, because
            // it is not perfectly centered otherwise
            paddingBottom: 0.3 * i,
            opacity: i === -1 || i === 61 ? 0 : 1,
            ...FONTS.body,
          }}
          key={`h${i}`}
          // onPress={() => {
          //     setM(i + 1)
          //     // setPopup(false)
          //     // props.onClose()
          // }}
        >
          {item}
        </ClockInputPopupField>,
      );
    }
    MinutesCreate(minutes);
  }, []);

  useEffect(() => {
    if (props.forceClose) setPopup(false);
  }, [props.forceClose]);

  function formatTime(unit) {
    if (`${unit}`.length === 1) unit = `0${unit}`;
    return unit;
  }

  if (!Hours || !Minutes) return <View />;

  return (
    <View
      style={{
        backgroundColor: 'white',
        zIndex: 1000,
        ...props.containerStyle,
      }}>
      <View
        style={{
          width: '100%',
          height: popup ? height * 3 : height,
          ...props.innerContainerStyle,
        }}>
        {!popup ? (
          <TouchableHighlight
            style={{
              height,
              // width,
              // height,
              // backgroundColor: "white",
              justifyContent: 'center',
              alignItems: 'center',
            }}
            underlayColor="#00000008"
            onPress={() => {
              // setPopup(!popup)
              setPopup(true);
              if (props.onOpen) props.onOpen();
            }}>
            <Text
              style={{
                fontSize: 20,
                ...FONTS.body,
              }}>
              {h} : {formatTime(m)}
            </Text>
          </TouchableHighlight>
        ) : null}

        {popup ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <ClockInputPopup
              style={{flex: 36}}
              // width={width}
              // height={height * 3}
              value={h}
              onItemIdxChange={(idx) => {
                setH(idx);
                if (props.onChange) props.onChange(idx, m);
              }}>
              {Hours}
            </ClockInputPopup>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 45,
                paddingBottom: 5,
                ...FONTS.body,
              }}>
              :
            </Text>
            <ClockInputPopup
              style={{flex: 36}}
              // width={width}
              // height={height * 3}
              value={m}
              onItemIdxChange={(idx) => {
                setM(idx);
                if (props.onChange) props.onChange(h, idx);
              }}>
              {Minutes}
            </ClockInputPopup>
            <View
              style={{
                flex: 28,
                height: '100%',
                backgroundColor: '#242429',
              }}>
              <TouchableHighlight
                style={{height: '100%'}}
                onPress={() => {
                  setPopup(false);
                  if (props.onChange) props.onChange(h, m);
                }}
                underlayColor="#242429"
                backgroundColor="#f9f9f9">
                <Text
                  style={{
                    height: '100%',
                    color: '#f9f9f9',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 25,
                    marginTop: 75,
                    ...FONTS.body,
                  }}>
                  Ok
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
