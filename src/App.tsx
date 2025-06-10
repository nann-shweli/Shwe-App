import React, {useEffect} from 'react';
import RNBootSplash from 'react-native-bootsplash';

import AppNavigation from './navigation/AppNavigation';

const App = () => {
  useEffect(() => {
    const init = async () => {
      await RNBootSplash.hide({fade: true});
    };
    init();
  }, []);

  return <AppNavigation />;
};

export default App;
