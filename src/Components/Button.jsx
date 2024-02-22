import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {btnContainer} from '../common/button';

const Button = ({text, ViewStyle = {}, TextStyle, btnContainer, onPress}) => {
  return (
    <TouchableOpacity style={btnContainer} onPress={onPress}>
      <View style={[styles.btn, ViewStyle]}>
        <Text style={[TextStyle, styles.btnText]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btnText: {
    fontWeight: 'bold',
  },
  btn: {
    alignItems: 'center',
    margin: 20,
    padding: 10,
    width: 300,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F50057',
  },
});
