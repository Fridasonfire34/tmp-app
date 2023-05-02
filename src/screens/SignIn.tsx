import React, {useState, useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import Layout from '@app/components/layout';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {Box, Button, Input, Stack, Text, useToast, Image, TextField} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import * as Keychain from 'react-native-keychain';

type FormValues = {
  employeeNumber: string;
  password: string;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const itop = require ("./loginicon2.png");
  const passwordRef = useRef();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const toast = useToast();

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {
      employeeNumber: '',
      password: '',
    },
  });

  console.log(API_BASE_URL)
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    if (isValid) {
      try {
        const response = await axios(`${API_BASE_URL}/mobile/auth/sign-in`, {
          headers: {
            employee: data.employeeNumber,
            password: data.password,
          },
        });
        await Keychain.setGenericPassword(data.employeeNumber, data.password);
        await AsyncStorage.setItem('@user', JSON.stringify(response.data));
        toast.show({
          title: 'Bienvenido',
          description: 'Inicio de sesión exitoso',
          backgroundColor: 'green.600',
        });
        navigation.navigate('Main');
      } catch (error) {
        toast.show({
          title: 'Error',
          description: 'El número de empleado o la contraseña no son válidos',
          backgroundColor: 'red.600',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <Box style={styles.container}>
        <Text fontSize={'30'} fontFamily={'Gayathri-Bold'} textAlign={'center'} my={2}>
          TMP Picking System
        </Text>
        <View style={{alignItems:'center'}}><Image source={itop} style={styles.topimage} alt='login image'></Image></View>
        <Text fontSize={'25'} fontFamily={'Gayathri-Bold'} style={{marginTop:20}} textAlign={'center'}>Login</Text>
        <Box style={{justifyContent:'center', marginBottom:110, marginLeft:10, marginRight:10}}>
          <Controller
            name="employeeNumber"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
              my={3}
              size="lg"
              autoFocus={true}
                placeholder="Número de empleado"
                keyboardType="default"
                autoCapitalize="none"
                value={value}
                blurOnSubmit={false}
               onSubmitEditing={() => passwordRef.current.focus()}
                onChangeText={v => onChange(v)}
              />
            )}
            rules={{
              required: 'Por favor ingresa un número de empleado valido',
            }}
          />
          {!!errors.employeeNumber?.message && (
            <Text color="red.700">* {errors.employeeNumber?.message}</Text>
          )}
          <Stack direction="row" alignItems="center">
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                type="password"
                  size="lg"
                  my={3}
                ref={passwordRef}
                  placeholder="Contraseña"
                  secureTextEntry
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  onBlur={onBlur}
                  onChangeText={v => onChange(v)}
                />
              )}
              rules={{
                required: 'Por favor ingresa una contraseña valida',
              }}
            />
          </Stack>
          {!!errors.employeeNumber?.message && (
            <Text color="red.700">* {errors.password?.message}</Text>
          )}
          <Button background='darkBlue.600' my={3} isLoading={loading} onPress={handleSubmit(onSubmit)}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

const styles = StyleSheet.create({
  topimage:{
    marginTop:7,
    width:120,
    height:120,
    
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  form: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
  },
});
