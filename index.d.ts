import * as React from "react";

type TPhone = {
  dialCode: string;
  unmaskedPhoneNumber: string;
  phoneNumber: string;
  isVerified: boolean;
  selectedCountry: string;
};
export interface IPhoneInputProps {
  onChangeText(phoneInfo: TPhone): void;
  defaultCountry: string;
}

type Props = IPhoneInputProps;

declare class IntlPhoneInput extends React.Component<Props, any> {}
export default IntlPhoneInput;
