import {StatusBar as RNStatusBar, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const StatusBar = () => {
  const {top} = useSafeAreaInsets();

  return (
    <RNStatusBar
      showHideTransition="slide"
      barStyle={'dark-content'}
      translucent
      animated
    />
  );
};

export default StatusBar;
