import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';

const FormFragment = props => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.black}>{props.title}</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry={props.secureTextEntry}
        onChangeText={props.onChangeText}
        onPressIn={() => {
          props.setErrorMsg(null);
        }}></TextInput>
    </View>
  );
};

export default FormFragment;

const styles = StyleSheet.create({
  black: {
    color: 'black',
    fontSize: 18,
    margin: 4,
  },
  formContainer: {
    marginVertical: 5,
    marginHorizontal: 20,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'pink',
    borderRadius: 20,

    margin: 5,
  },
});
