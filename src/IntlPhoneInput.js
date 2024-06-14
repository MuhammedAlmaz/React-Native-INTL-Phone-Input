import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import data from './Countries';

export default class IntlPhoneInput extends React.Component {
  constructor(props) {
    super(props);
    const defaultCountry = data.filter((obj) => obj.code === props.defaultCountry)[0] || data.filter((obj) => obj.code === 'TR')[0];
    this.state = {
      defaultCountry,
      flag: defaultCountry.flag,
      modalVisible: false,
      dialCode: defaultCountry.dialCode,
      phoneNumber: '',
      mask: props.mask || defaultCountry.mask,
      countryData: data,
      selectedCountry:defaultCountry,
      placeholderTextColor: 'grey',

      countryCodeChanged: false, // Bilal: added this property for use with RTL
    };
  }

  onChangePropText=(unmaskedPhoneNumber, phoneNumber) => {
    const { dialCode, mask, selectedCountry } = this.state;
    const countOfNumber = mask.match(/9/g).length;
    if (this.props.onChangeText) {
      const isVerified = countOfNumber === unmaskedPhoneNumber?.length && phoneNumber?.length > 0;
      this.props.onChangeText({
        dialCode, unmaskedPhoneNumber, phoneNumber, isVerified,selectedCountry
      });
    }
  }

  onChangeText = (value) => {
    let unmaskedPhoneNumber = (value.match(/\d+/g) || []).join('');

    if (unmaskedPhoneNumber.length === 0) {
      this.setState({ phoneNumber: '' });
      this.onChangePropText('', '');
      return;
    }

    let phoneNumber = this.state.mask.replace(/9/g, '_');
    for (let index = 0; index < unmaskedPhoneNumber.length; index += 1) {
      phoneNumber = phoneNumber.replace('_', unmaskedPhoneNumber[index]);
    }
    let numberPointer = 0;
    for (let index = phoneNumber.length; index > 0; index -= 1) {
      if (phoneNumber[index] !== ' ' && !isNaN(phoneNumber[index])) {
        numberPointer = index;
        break;
      }
    }
    phoneNumber = phoneNumber.slice(0, numberPointer + 1);
    unmaskedPhoneNumber = (phoneNumber.match(/\d+/g) || []).join('');

    this.onChangePropText(unmaskedPhoneNumber, phoneNumber);
    this.setState({ phoneNumber });
  }

  showModal = () => (this.props.disableCountryChange ? null : this.setState({ modalVisible: true }));
  hideModal = () => this.setState({ modalVisible: false });

  onCountryChange = async (code) => {
    this.setState({ countryCodeChanged: true });
    const countryData = data;
    let newState = {};
    try {
      const country = countryData.filter((obj) => obj.code === code)[0];

      // Bilal: For some reason if the Android device (not the app) has the default language set to an RTL language
      //    the mask functionality does NOT work. Until we figure out this mysterious behaviour, I thought
      //    we should add a mask ONLY if the device's default language is NOT RTL.
      //  If the property deviceRTL is NOT set (the developer does not add it to their code),
      //    it has the default value of false. This make this library's downward compatible with older versions that do not support RTL.
      newState = {
        dialCode: country.dialCode,
        flag: country.flag,
        // mask: this.props.mask || country.mask, // Bilal: this is the original code
        phoneNumber: '',
        selectedCountry:country
      };
      if (!this.props.deviceRTL) { newState = { ...newState, mask: this.props.mask || country.mask }; } // Bilal
      this.setState(newState);
      this.hideModal();
    } catch (err) {
      const defaultCountry = this.state.defaultCountry;
      newState = {
        dialCode: defaultCountry.dialCode,
        flag: defaultCountry.flag,
        // mask: this.props.mask || defaultCountry.mask, // Bilal: this is the original code
        phoneNumber: '',
        selectedCountry:defaultCountry
      };
      if (!this.props.deviceRTL) { newState = { ...newState, mask: this.props.mask || defaultCountry.mask }; } // Bilal
      this.setState(newState);
    }
  }

  filterCountries = (value) => {
    const { lang } = this.props;
    const countryData = data.filter((obj) => (obj[lang?.toLowerCase()??"en"]?.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1));
    this.setState({ countryData });
  }

  focus() {
    this.props.inputRef.current.focus();
  }

  renderModal=() => {
    if (this.props.customModal) return this.props.customModal(this.state.modalVisible,this.state.countryData,this.onCountryChange);
    const {
      countryModalStyle,
      modalContainer,
      modalFlagStyle,
      filterInputStyle,
      modalCountryItemCountryNameStyle,
      modalCountryItemCountryDialCodeStyle,
      closeText,
      filterText,
      searchIconStyle,
      closeButtonStyle,
      lang,
      placeholderTextColor
    } = this.props;
    return (
      <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.modalContainer, modalContainer]}>
          <View style={styles.filterInputStyleContainer}>
            <TextInput autoCapitalize="words" autoFocus onChangeText={this.filterCountries} placeholder={filterText || 'Filter'} style={[styles.filterInputStyle, filterInputStyle]} placeholderTextColor={placeholderTextColor }/>
            <Text style={[styles.searchIconStyle, searchIconStyle]}>🔍</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={this.state.countryData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={
              ({ item }) => {
                // Bilal: For some reason if the Android device (not the app) has the default language set to an RTL language
                //    the country code is displayed wrong (61+). Until we figure out this mysterious behaviour, I thought
                //    we should swap the country code string if the device's default language is RTL.
                //  If the property deviceRTL is NOT set (the developer does not add it to their code),
                //    it has the default value of false. This make this library's downward compatible with older versions that do not support RTL.
                let dialCodeWithPlus = item.dialCode;
                if (this.props.deviceRTL && item.dialCode.slice(0, 1) === "+") {
                  dialCodeWithPlus = item.dialCode.slice(1) + item.dialCode.slice(0, 1);
                }

                // Bilal: If the app is in RTL mode, we need to swap the horizontal display of the flag, country name & country code.
                //  If the property appRTL is NOT set (the developer does not add it to their code),
                //    it has the default value of false. This make this library's downward compatible with older versions that do not support RTL.
                const flagComponent = <Text style={[styles.modalFlagStyle, modalFlagStyle]}>{item.flag + " "}</Text>;
                const countryCode = <Text style={[styles.modalCountryItemCountryNameStyle, modalCountryItemCountryNameStyle]}>{item[lang?.toLowerCase()??"en"]}</Text>
                const countryName = <Text style={[styles.modalCountryItemCountryDialCodeStyle, modalCountryItemCountryDialCodeStyle]}>{dialCodeWithPlus}</Text>;
                return (
                <TouchableWithoutFeedback onPress={() => this.onCountryChange(item.code)}>
                  <View style={[styles.countryModalStyle, countryModalStyle]}>
                    {/* Bilal: If the app is in RTL mode, we need to swap the horizontal display of the flag & country code. */}
                    {!this.props.appRTL && flagComponent}
                    <View style={styles.modalCountryItemContainer}>
                      {!this.props.appRTL && countryCode}
                      {!this.props.appRTL && countryName}

                      {this.props.appRTL && countryName}
                      {this.props.appRTL && countryCode}
                    </View>
                    {this.props.appRTL && flagComponent}
                  </View>
                </TouchableWithoutFeedback>
              )}
            }
          />
        </View>
        <TouchableOpacity onPress={() => this.hideModal()} style={[styles.closeButtonStyle, closeButtonStyle]}>
          <Text style={styles.closeTextStyle}>{closeText || 'CLOSE'}</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }

  renderAction=()=>{
    const renderAction=this.props.renderAction;
    if(renderAction) {
      if(typeof renderAction!=="function") throw ("The renderAction is not a function. Please set a renderAction function on there");
      else return this.props.renderAction();
    }
    return null;
  }

  render() {
    const { flag } = this.state;
    const {
      containerStyle,
      flagStyle,
      phoneInputStyle,
      dialCodeTextStyle,
      inputProps,
      placeholderTextColor,
    } = this.props;

    const countryComponent = () => {
      // Bilal: For some reason if the Android device (not the app) has the default language set to an RTL language
      //    the country code is displayed wrong (61+). Until we figure out this mysterious behaviour, I thought
      //    we should swap the country code string if the device's default language is RTL.
      //  If the property deviceRTL is NOT set (the developer does not add it to their code),
      //    it has the default value of false. This make this library's downward compatible with older versions that do not support RTL.
      let dialCodeWithPlus = this.state.dialCode;
      if (this.props.deviceRTL && this.state.countryCodeChanged && dialCodeWithPlus.slice(0, 1) === "+") {
        dialCodeWithPlus = dialCodeWithPlus.slice(1) + dialCodeWithPlus.slice(0, 1);
      }

      // Bilal: If the app is in RTL mode, we need to swap the horizontal display of the flag & country code.
      //  If the property appRTL is NOT set (the developer does not add it to their code),
      //    it has the default value of false. This make this library's downward compatible with older versions that do not support RTL.
      const flagComponent = <Text style={[styles.flagStyle, flagStyle]}>{flag + " "}</Text>;
      const countryCode = <Text style={[styles.dialCodeTextStyle, dialCodeTextStyle]}>{dialCodeWithPlus + " "}</Text>;
      return (
      <TouchableOpacity onPress={() => this.showModal()}>
        <View style={styles.openDialogView}>
          {/* Bilal: If the app is in RTL mode, we need to swap the horizontal display of the flag & country code. */}
          {!this.props.appRTL && flagComponent}
          {!this.props.appRTL && countryCode}

          {this.props.appRTL && countryCode}
          {this.props.appRTL && flagComponent}
        </View>
      </TouchableOpacity>);
    };

    const phoneInputComponent =
    <TextInput
      {...inputProps}
      style={[styles.phoneInputStyle, phoneInputStyle]}
      placeholder={this.props.placeholder || this.state.mask.replace(/9/g, '_')}
      autoCorrect={false}
      keyboardType="number-pad"
      secureTextEntry={false}
      value={this.state.phoneNumber}
      onChangeText={this.onChangeText}
      placeholderTextColor={placeholderTextColor}
    />;

    return (
      <View style={{ ...styles.container, ...containerStyle }}>
        {/* Bilal: If the app is in RTL mode, we need to swap the horizontal display of the flag & country code. */}
        {!this.props.appRTL && countryComponent()}
        {!this.props.appRTL && phoneInputComponent}

        {this.props.appRTL && phoneInputComponent}
        {this.props.appRTL && countryComponent()}

        {this.renderAction()}
        {this.renderModal()}
        </View>
    );
  }
}

IntlPhoneInput.propTypes = {
  lang: PropTypes.string,
  defaultCountry: PropTypes.string,
  mask: PropTypes.string,
  onChangeText: PropTypes.func,
  customModal: PropTypes.func,
  phoneInputStyle: PropTypes.object, // {}
  containerStyle: PropTypes.object, // {}
  dialCodeTextStyle: PropTypes.object, // {}
  flagStyle: PropTypes.object, // {}
  modalContainer: PropTypes.object, // {}
  filterInputStyle: PropTypes.object, // {}
  closeButtonStyle: PropTypes.object, // {}
  modalCountryItemCountryNameStyle: PropTypes.object, // {}
  filterText: PropTypes.string,
  closeText: PropTypes.string,
  searchIconStyle: PropTypes.object,
  disableCountryChange: PropTypes.bool,
  inputRef: PropTypes.object,
  placeholderTextColor: PropTypes.string
};

const styles = StyleSheet.create({
  closeTextStyle: {
    padding: 5,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  modalCountryItemCountryDialCodeStyle: {
    fontSize: 15
  },
  modalCountryItemCountryNameStyle: {
    flex: 1,
    fontSize: 15
  },
  modalCountryItemContainer: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: 'row'
  },
  modalFlagStyle: {
    fontSize: 25,
  },
  modalContainer: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 10,
    backgroundColor: 'white'
  },
  flagStyle: {
    fontSize: 35,
  },
  dialCodeTextStyle: {
  },
  countryModalStyle: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchIcon: {
    padding: 10,
  },
  filterInputStyleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputStyle: {
    marginLeft: 5,
    flex: 1
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchIconStyle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  countryStyle: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    padding: 12,
    alignItems: 'center',
  }
});
