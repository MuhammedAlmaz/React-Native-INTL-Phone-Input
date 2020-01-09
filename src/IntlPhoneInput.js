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
    const defaultCountry =
        data.filter((obj) => obj.code === props.defaultCountry)[0] || data.filter((obj) => obj.code === "TR")[0];
    this.state = {
      defaultCountry,
      flag: defaultCountry.flag,
      modalVisible: false,
      dialCode: defaultCountry.dialCode,
      phoneNumber: '',
      mask: defaultCountry.mask,
      countryData: data
    };
  }

  onChangePropText=(unmaskedPhoneNumber, phoneNumber) => {
    const { dialCode, mask } = this.state;
    const countOfNumber = mask.match(/9/g).length;
    if (this.props.onChangeText) {
      const isVerified = countOfNumber === unmaskedPhoneNumber.length && phoneNumber.length > 0;
      this.props.onChangeText({
        dialCode, unmaskedPhoneNumber, phoneNumber, isVerified
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
    unmaskedPhoneNumber = phoneNumber.match(/9/g).length;

    this.onChangePropText(unmaskedPhoneNumber, phoneNumber);
    this.setState({ phoneNumber });
  }


  showModal = () => this.setState({ modalVisible: true });

  hideModal = () => this.setState({ modalVisible: false });

  onCountryChange = async (countryName) => {
    const countryData = await data;
    try {
      const country = await countryData.filter((obj) => obj.name === countryName)[0];
      this.setState({
        dialCode: country.dialCode,
        flag: country.flag,
        mask: country.mask,
        phoneNumber: ''
      });
      this.hideModal();
    } catch (err) {
      const defaultCountry = this.state.defaultCountry;
      this.setState({
        dialCode: defaultCountry.dialCode,
        flag: defaultCountry.flag,
        mask: defaultCountry.mask,
        phoneNumber: ''
      });
    }
  }

  filterCountries = (value) => {
    const countryData = data.filter((obj) => (obj.name.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1));
    this.setState({ countryData });
  }

  render() {
    const { flag } = this.state;
    const {
      containerStyle,
      flagStyle,
      phoneInputStyle,
      dialCodeTextStyle,
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
      inputProps
    } = this.props;
    return (
        <View style={{ ...styles.container, ...containerStyle }}>
          <TouchableOpacity onPress={() => this.showModal()}>
            <View style={styles.openDialogView}>
              <Text style={[styles.flagStyle, flagStyle]}>{flag}</Text>
              <Text style={[styles.dialCodeTextStyle, dialCodeTextStyle]}>{this.state.dialCode}</Text>
            </View>
          </TouchableOpacity>

          <TextInput
              {...inputProps}
              style={[styles.phoneInputStyle, phoneInputStyle]}
              placeholder={this.props.placeholder || this.state.mask.replace(/9/g, '_')}
              autoCorrect={false}
              keyboardType="number-pad"
              secureTextEntry={false}
              value={this.state.phoneNumber}
              onChangeText={this.onChangeText}
          />
          <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={[styles.modalContainer, modalContainer]}>
                <View style={styles.filterInputStyleContainer}>
                  <TextInput autoCompleteType={false} onChangeText={this.filterCountries} placeholder={filterText || 'Filter'} style={[styles.filterInputStyle, filterInputStyle]} />
                  <Text style={[styles.searchIconStyle, searchIconStyle]}>🔍</Text>
                </View>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.countryData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={
                      ({ item }) => (
                          <TouchableWithoutFeedback onPress={() => this.onCountryChange(item.name)}>
                            <View style={[styles.countryModalStyle, countryModalStyle]}>
                              <Text style={[styles.modalFlagStyle, modalFlagStyle]}>{item.flag}</Text>
                              <View style={styles.modalCountryItemContainer}>
                                <Text style={[styles.modalCountryItemCountryNameStyle, modalCountryItemCountryNameStyle]}>{item.name}</Text>
                                <Text style={[styles.modalCountryItemCountryDialCodeStyle, modalCountryItemCountryDialCodeStyle]}>{`  ${item.dialCode}`}</Text>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                      )
                    }
                />
              </View>
              <TouchableOpacity onPress={() => this.hideModal()} style={[styles.closeButtonStyle, closeButtonStyle]}>
                <Text style={styles.closeTextStyle}>{closeText || 'CLOSE'}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
        </View>


    );
  }
}

IntlPhoneInput.propTypes = {
  defaultCountry: PropTypes.string,
  onChangeText: PropTypes.func,
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
