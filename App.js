/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { View, SafeAreaView } from 'react-native';
import IntlPhoneInput from './src/IntlPhoneInput';


const App: () => React$Node = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'black' }}>
      <IntlPhoneInput defaultCountry="TR" />
    </View>
  </SafeAreaView>

);

export default App;
