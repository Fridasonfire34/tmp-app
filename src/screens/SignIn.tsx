import React from 'react';
import {StyleSheet} from 'react-native';

import Layout from '@app/components/layout';
import {Box, Button, Input, Text} from 'native-base';
import {Controller, useForm} from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
};

export default function SignIn() {
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
          {!!errors.email?.message && (
            <Text color="red.700">* {errors.password?.message}</Text>
          )}
          <Button my={3} onPress={handleSubmit(onSubmit)}>
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
