import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screen/Home';
import Detail from '../screen/Detail';
import StatusBar from '../component/StatusBar';
import Property from '../screen/Property';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{
              headerShown: true,
              title: 'ရွှေအလေးချိန် တွက်ချက်ခြင်း',
              headerBackTitle: '',
            }}
          />
          <Stack.Screen
            name="MyProperty"
            component={Property}
            options={{
              title: 'ပိုင်ဆိုင်မှု',
              headerBackTitle: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigation;
