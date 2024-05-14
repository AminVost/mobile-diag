/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import App from './App';
import {name as appName} from './app.json';
// hideNavigationBar();

AppRegistry.registerComponent(appName, () => App);
