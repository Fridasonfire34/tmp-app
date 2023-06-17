import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Platform, RefreshControl, StyleSheet} from 'react-native';

import {
  getSequences,
  postCreateReport,
  postRemoveSequence,
} from '@app/api/sequences';
import Layout from '@app/components/layout';
import {sumRestParts} from '@app/utils/sequences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ParamListBase, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AlertDialog,
  Box,
  Button,
  Input,
  Stack,
  Text,
  useToast,
  View,
} from 'native-base';
import RNFetchBlob from 'react-native-blob-util';
import {SkypeIndicator} from 'react-native-indicators';
import * as Keychain from 'react-native-keychain';

export default function Search() {
  const cancelDialogRef = useRef(null);

  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [numberRestPackings, setNumberRestPackings] = useState<number>(0);
  const [numberPart, setNumberPart] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const toast = useToast();

  const {packing}: any = route.params;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@user');
    await Keychain.resetGenericPassword();
    navigation.navigate('SignIn');
  };

  const handleShare = async (source: any) => {
    try {
      const src = RNFetchBlob.fs.dirs.DownloadDir + `/report-${Date.now()}.pdf`;
      RNFetchBlob.fs
        .writeFile(src, source, 'base64')
        .then(() => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.ios.openDocument(src);
          } else {
            RNFetchBlob.android.actionViewIntent(src, 'application/pdf');
          }
          handleLogout();
        })
        .catch(err => {
          console.log(err);
          toast.show({
            title: 'Error',
            description: 'No se pudo compartir el reporte' + err,
          });
        });
    } catch (e) {
      console.log(e);
      toast.show({
        title: 'Error',
        description: 'No se pudo compartir el reporte',
      });
    }
  };

  const handleCreateReport = () => {
    setIsOpenDialog(false);
    setLoading(true);
    postCreateReport(packing)
      .then(res => {
        const {stack} = res;
        setNumberPart('');
        setNumberRestPackings(0);
        handleShare(stack);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirmCreateReport = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleRemove = (id: string) => {
    setLoading(true);
    postRemoveSequence(id)
      .then(() => {
        fetchData();
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveFilter = () => {
    setLoading(true);
    const parts = filteredData.find((f: any) => f.partNumber === numberPart);
    if (!parts) {
      setLoading(false);
    } else {
      const id = parts?.parts[0]?.id;
      postRemoveSequence(id)
        .then(() => {
          fetchData();
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChangeSearch = (value: string) => {
    const fortmatValue = value.trim();
    setNumberPart(fortmatValue);
    if (fortmatValue.length) {
      const filtered = data.filter((item: any) => {
        return item.parts.find((part: any) => {
          return part.partNumber.includes(fortmatValue);
        });
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleReset = () => {
    setError(false);
    setNumberRestPackings(0);
    setNumberPart('');
  };

  const fetchData = useCallback(() => {
    handleReset();
    setLoading(true);
    getSequences(Number(packing))
      .then((response: any) => {
        const list = response?.stack;
        const rest = sumRestParts(list);
        setNumberRestPackings(rest);
        setData(list);
        setFilteredData(list);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [packing]);

  useEffect(() => {
    fetchData();
  }, [fetchData, packing]);

  return (
    <Layout>
      {!loading && error && (
        <Box style={styles.container}>
          <Text style={styles.text}>
            No se encontraron resultados para el número de packing ingresado.
          </Text>
        </Box>
      )}
      {!error && data && (
        <Box style={styles.content}>
          <Stack direction="row" justifyContent="space-between">
            <Text fontSize="sm" my={2} fontWeight="500">
              Packing: {packing}
            </Text>
            <Text fontSize="sm" my={2} fontWeight="500">
              Piezas restantes: {numberRestPackings}
            </Text>
          </Stack>
          <Input
            my={3}
            size="lg"
            placeholder="Ingrese el número de parte"
            autoCapitalize="none"
            returnKeyType="send"
            isDisabled={loading || error || !data.length}
            value={numberPart}
            onChangeText={handleChangeSearch}
            onSubmitEditing={() => handleRemoveFilter()}
          />
          {loading && (
            <Box style={styles.container}>
              <View style={styles.loading}>
                <SkypeIndicator size={50} />
              </View>
              <Text style={styles.text}>Cargando información...</Text>
            </Box>
          )}
          {!loading && (
            <>
              <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={fetchData} />
                }
                renderItem={({item}) => (
                  <View>
                    {item?.parts.map((part: any, index: number) => {
                      return (
                        <Stack
                          key={index}
                          direction="row"
                          justifyContent="space-between"
                          alignContent="center"
                          alignItems="center"
                          my={2}>
                          <Box>
                            <Stack
                              direction="row"
                              justifyContent="space-between">
                              <Text fontSize="sm" my={2} fontWeight="500">
                                {part.partNumber}
                              </Text>
                            </Stack>
                          </Box>
                          <Button
                            bgColor="red.500"
                            width={10}
                            height={10}
                            borderRadius={20}
                            onPress={() => handleRemove(item.id)}>
                            X
                          </Button>
                        </Stack>
                      );
                    })}
                  </View>
                )}
                ListEmptyComponent={
                  <Text fontSize="sm" my={2} fontWeight="500">
                    No se encontraron resultados
                  </Text>
                }
              />
              <Button
                mt={5}
                isDisabled={loading || error}
                onPress={handleConfirmCreateReport}>
                Generar reporte
              </Button>
            </>
          )}
        </Box>
      )}

      <AlertDialog
        leastDestructiveRef={cancelDialogRef}
        isOpen={isOpenDialog}
        onClose={handleCloseDialog}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Mensaje</AlertDialog.Header>
          <AlertDialog.Body>
            ¿Está seguro de generar reporte para este Packing?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={handleCloseDialog}
                ref={cancelDialogRef}>
                Cancelar
              </Button>
              <Button colorScheme="cyan" onPress={handleCreateReport}>
                Confirmar
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
    flexGrow: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  loading: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    marginTop: 15,
  },
});
