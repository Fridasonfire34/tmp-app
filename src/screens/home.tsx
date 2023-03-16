import React from 'react';

import Layout from '@app/components/layout';
import {useAppSelector} from '@app/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, Button} from 'native-base';
import * as Keychain from 'react-native-keychain';

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const {user, error, loading} = useAppSelector(state => state.signIn);

  console.log('user', user);
  console.log('error', error);
  console.log('loading', loading);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user');
    await Keychain.resetGenericPassword();
    navigation.navigate('SignIn');
  };

  return (
    <Layout>
      <Box>Hello world</Box>
      <Button onPress={handleLogout}>Cerrar sesión</Button>
    </Layout>
  );
}
