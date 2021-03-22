import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {FONTS} from '../contexts/Styles';
import dateformat from 'dateformat';

export default function DateSelector(props) {
  const [dates, setDates] = useState({});
  // const [dateStringList, setDateStringList] = useState(props.value || [])

  function processTapOnDay(date) {
    // Must create a new object, in order to not provide the same reference,
    // otherwise neither this React component will update, nor <Calendar />
    let newDates = {...dates};
    if (!newDates[date.dateString]) newDates[date.dateString] = {};
    newDates[date.dateString] = Object.keys(newDates[date.dateString]).length
      ? {}
      : {selected: true};

    setDates(newDates);

    let dateStringList = [];
    Object.entries(newDates).forEach(([dateString, info]) => {
      if (info.selected) dateStringList.push(dateString);
    });
    // setDateStringList(dateStringList)
    if (props.onDayPress) props.onDayPress(dateStringList);
  }

  return (
    <View style={{...props.containerStyle}}>
      <View style={{...props.innerContainerStyle}}>
        <Calendar
          markedDates={dates}
          onDayPress={processTapOnDay}
          onDayLongPress={processTapOnDay}
          minDate={dateformat(new Date(), 'yyyy-mm-dd')}
          theme={{
            textSectionTitleColor: '#242429',
            dayTextColor: '#242429',
            textSectionTitleDisabledColor: '#242429',
            selectedDayBackgroundColor: '#242429',
            dotColor: '#242429',
            selectedDotColor: '#f9f9f9',
            arrowColor: '#242429',
            monthTextColor: '#242429',
            indicatorColor: '#242429',
            textDayFontFamily: FONTS.cardBody.fontFamily,
            textMonthFontFamily: FONTS.cardBody.fontFamily,
            textDayHeaderFontFamily: FONTS.cardBody.fontFamily,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
