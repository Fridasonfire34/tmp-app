import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import Layout from '@app/components/layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AlertDialog, Box, Button, Input, Stack, Text} from 'native-base';
import {Controller, useForm} from 'react-hook-form';
import * as Keychain from 'react-native-keychain';

type FormValues = {
  packingDiskNo: string;
};

export default function Home() {
  const [user, setUser] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const {
    handleSubmit,
    control,
    formState: {errors, isValid},
    reset,
  } = useForm({
    defaultValues: {
      packingDiskNo: '',
    },
  });

  const onClose = () => setIsOpen(false);

  const handleLogout = async () => {
    onClose();
    await AsyncStorage.removeItem('@user');
    await Keychain.resetGenericPassword();
    navigation.navigate('SignIn');
  };

  const onSubmit = async (data: FormValues) => {
    if (isValid) {
      reset();
      navigation.push('Search', {packing: data.packingDiskNo});
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const store: any = await AsyncStorage.getItem('@user');
      setUser(JSON.parse(store)?.stack);
    };
    getUser();
  }, []);

  return (
    <Layout>
      <Box style={styles.container}>
        <Text fontSize="2xl" my={2}>
          TMP | Inicio
        </Text>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="md">Bienvenido {user?.name}</Text>
          <Button variant="ghost" onPress={() => setIsOpen(true)}>
            Cerrar sesión
          </Button>
        </Stack>
        <Box style={styles.form}>
          <Controller
            name="packingDiskNo"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                my={3}
                placeholder="Packing Disk No"
                autoCapitalize="none"
                size="lg"
                value={value}
                onBlur={onBlur}
                onChangeText={v => onChange(v.trim())}
              />
            )}
            rules={{
              required: 'El Packing Disk No es requerido',
              pattern: {
                value: /^[0-9]+$/,
                message: 'El Packing Disk No debe ser numérico',
              },
            }}
          />
          {!!errors.packingDiskNo?.message && (
            <Text color="red.700">* {errors.packingDiskNo?.message}</Text>
          )}
          <Button my={3} onPress={handleSubmit(onSubmit)}>
            Buscar
          </Button>
        </Box>
      </Box>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Mensaje</AlertDialog.Header>
          <AlertDialog.Body>
            ¿Está seguro que desea cerrar sesión?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onPress={handleLogout}>
                Cerrar sesión
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
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
