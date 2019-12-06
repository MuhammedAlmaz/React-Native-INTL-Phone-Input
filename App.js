/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, SafeAreaView } from 'react-native';
import PhoneInput from './src/PhoneInput';


const App: () => React$Node = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'black' }}>
      <PhoneInput defaultCountry="US" />
    </View>
  </SafeAreaView>

);

export default App;
