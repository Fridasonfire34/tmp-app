import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import Layout from '@app/components/layout';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {Box, Button, Image, Input, Stack, Text, useToast} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import * as Keychain from 'react-native-keychain';

type FormValues = {
  employeeNumber: string;
  password: string;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const itop = require('./loginicon2.png');
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const toast = useToast();

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {
      employeeNumber: '',
      password: '',
    },
  });

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
        reset();
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
        <Text fontSize={'30'} textAlign={'center'} my={2}>
          TMP Picking System
        </Text>
        <View style={styles.viewImage}>
          <Image source={itop} style={styles.topimage} alt="login image" />
        </View>
        <Text marginY={5} fontSize={'25'} textAlign={'center'}>
          Inicio de sesión
        </Text>
        <Box style={styles.viewInputs}>
          <Controller
            name="employeeNumber"
            control={control}
            render={({field: {onChange, value}}) => (
              <Input
                my={3}
                size="lg"
                autoFocus={true}
                placeholder="Número de empleado"
                keyboardType="default"
                autoCapitalize="none"
                value={value}
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef?.current?.focus()}
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
          <Button
            background="darkBlue.600"
            my={3}
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

const styles = StyleSheet.create({
  topimage: {
    marginTop: 7,
    width: 120,
    height: 120,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
  },
  viewImage: {
    alignSelf: 'center',
  },
  viewInputs: {
    justifyContent: 'center',
    marginBottom: 110,
    marginLeft: 10,
    marginRight: 10,
  },
});
