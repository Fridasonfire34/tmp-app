import React, {useEffect, useState} from 'react';

import Loading from '@app/components/loading';
import {store} from '@app/redux/store';
import Home from '@app/screens/Home';
import Search from '@app/screens/Search';
import SignIn from '@app/screens/SignIn';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import * as Keychain from 'react-native-keychain';
import {Provider} from 'react-redux';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const veryfiKey = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setInitialRoute('Home');
      } else {
        await Keychain.resetGenericPassword();
        setInitialRoute('SignIn');
      }
    };
    veryfiKey();
  }, []);

  if (!initialRoute) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute as string}>
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{
                headerTitle: '',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
