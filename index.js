/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import IntlPhoneInput from "./src/IntlPhoneInput";

AppRegistry.registerComponent(appName, () => App);

export default IntlPhoneInput;
