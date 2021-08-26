/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import IntlPhoneInput from "./src/IntlPhoneInput";
import Countries from "./src/Countries";

AppRegistry.registerComponent(appName, () => App);

export default IntlPhoneInput;
export { Countries }
