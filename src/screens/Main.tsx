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

export default function Main() {
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
        <Text fontSize="30" my={2} style={{fontFamily:'Gayathri-Bold', textAlign:'center'}}>
          TMP | Picking System
        </Text>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="md" fontFamily={'Gayathri-Bold'}>Entraste como: {user?.name}</Text>
        </Stack>
        <Box style={styles.form}>
          <Controller
            name="packingDiskNo"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
              autoFocus={true}
                my={3}
                placeholder="Packing Disk No"
                autoCapitalize="none"
                size="lg"
                value={value}
                onSubmitEditing={handleSubmit(onSubmit)}
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
          <Button my={3} onPress={handleSubmit(onSubmit)} background='darkBlue.600'>
            Buscar
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
