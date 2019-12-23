# React-Native-INTL-Phone-Input
It's an international phone input with phone mask. 

![](mgif.gif)


# USAGE

install npm library
```
npm install react-native-intl-phone-input
```


İmport library
```
import IntlPhoneInput from 'react-native-intl-phone-input';
```
use component
```
  onChangeText = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
    console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
  };
  render() {
    return (
      <SafeAreaView>
        <IntlPhoneInput onChangeText={this.onChangeText} defaultCountry="TR" />
      </SafeAreaView>
    );
  }
```
prop names |type |default value | comment 
--- | --- | --- | --- 
placeholder | String |  | This prop change the phone input placeholder
defaultCountry | String | TR | You can change your default country code 
phoneInputStyle | Style |  | This prop is about the text field's ReactNative.TextInput style 
onChangeText | Function |  | This function works when input text is changed 
containerStyle | Style |  | This prop is about the text field's container style 
dialCodeTextStyle | Style |  |  
flagStyle | Style |  |  
modalContainer | Style |  | This prop is about the modal field's SafeAreaView style.
filterInputStyle | Style |  | This prop is about the top of model filter text style 
closeButtonStyle | Style |  | This prop is about text style of bottom modal
modalCountryItemCountryNameStyle | Style |  |  
filterText | String | Filter | This is the text of placeholder input of top modal 
closeText | String | CLOSE | This prop is about the text of bottom modal 

