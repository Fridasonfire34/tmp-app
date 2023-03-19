import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import Layout from '@app/components/layout';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import {Box, Button, Input, Stack, Text, useToast} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import * as Keychain from 'react-native-keychain';

type FormValues = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const toast = useToast();

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    if (isValid) {
      try {
        const response = await axios(`${API_BASE_URL}/mobile/auth/sign-in`, {
          headers: {
            email: data.email,
            password: data.password,
          },
        });
        await Keychain.setGenericPassword(data.email, data.password);
        await AsyncStorage.setItem('@user', JSON.stringify(response.data));
        toast.show({
          title: 'Bienvenido',
          description: 'Inicio de sesión exitoso',
          backgroundColor: 'green.600',
        });
        navigation.navigate('Home');
      } catch (error) {
        toast.show({
          title: 'Error',
          description: 'El correo electrónico o la contraseña no son válidos',
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
        <Text fontSize="2xl" my={2}>
          TMP | Bienvenido
        </Text>
        <Text fontSize="md">Inicio de sesión</Text>
        <Box style={styles.form}>
          <Controller
            name="email"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                my={3}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                size="lg"
                value={value}
                onBlur={onBlur}
                onChangeText={v => onChange(v)}
              />
            )}
            rules={{
              required: 'El correo electrónico es requerido',
              pattern: /^\S+@\S+$/i,
            }}
          />
          {!!errors.email?.message && (
            <Text color="red.700">* {errors.email?.message}</Text>
          )}
          <Stack direction="row" alignItems="center">
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  my={3}
                  placeholder="Contraseña"
                  type="password"
                  size="lg"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={v => onChange(v)}
                />
              )}
              rules={{
                required: 'La contraseña es requerida',
              }}
            />
          </Stack>
          {!!errors.email?.message && (
            <Text color="red.700">* {errors.password?.message}</Text>
          )}
          <Button my={3} isLoading={loading} onPress={handleSubmit(onSubmit)}>
            Inicio de sesión
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

const styles = StyleSheet.create({
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
