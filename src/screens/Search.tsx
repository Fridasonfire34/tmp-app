import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';

import {getSequences, postRemoveSequence} from '@app/api/sequences';
import Layout from '@app/components/layout';
import {sumRestParts} from '@app/utils/sequences';
import {useRoute} from '@react-navigation/native';
import {Box, Button, Input, Stack, Text, View} from 'native-base';
import {SkypeIndicator} from 'react-native-indicators';

export default function Search() {
  const [data, setData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [numberRestPackings, setNumberRestPackings] = useState<number>(0);
  const [numberPart, setNumberPart] = useState<string>('');

  const route = useRoute();
  const {packing}: any = route.params;

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

  const handleChangeSearch = (value: string) => {
    setNumberPart(value);
    if (value.length) {
      const filtered = data.filter((item: any) => {
        return item.parts.find((part: any) => {
          return part.partNumber.includes(value);
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
          <Text fontSize="2xl" my={2}>
            Resultados de la búsqueda
          </Text>
          <Stack direction="row" justifyContent="space-between">
            <Text fontSize="sm" my={2} fontWeight="500">
              Packing: {packing}
            </Text>
            <Text fontSize="sm" my={2} fontWeight="500">
              Partes restantes: {numberRestPackings}
            </Text>
          </Stack>
          <Input
            my={3}
            placeholder="Ingrese el número de parte"
            autoCapitalize="none"
            size="lg"
            returnKeyType="search"
            isDisabled={loading || error || !data.length}
            value={numberPart}
            onChangeText={handleChangeSearch}
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
                          <Stack direction="row" justifyContent="space-between">
                            <Text fontSize="sm" my={2} fontWeight="500">
                              ID
                            </Text>
                            <Text fontSize="sm" my={2} fontWeight="500">
                              {part.id}
                            </Text>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Text fontSize="sm" my={2} fontWeight="500">
                              Packing Disk No.
                            </Text>
                            <Text fontSize="sm" my={2} fontWeight="500">
                              {part.packingDiskNo}
                            </Text>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Text fontSize="sm" my={2} fontWeight="500">
                              Part No.
                            </Text>
                            <Text fontSize="sm" my={2} fontWeight="500">
                              {part.partNumber}
                            </Text>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Text fontSize="sm" my={2} fontWeight="500">
                              Quantity
                            </Text>
                            <Text fontSize="sm" my={2} fontWeight="500">
                              {part.quantity}
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
              ListFooterComponent={
                <Button mt={5} isDisabled={loading || error || !data.length}>
                  Generar reporte
                </Button>
              }
              ListEmptyComponent={
                <Text fontSize="sm" my={2} fontWeight="500">
                  No se encontraron resultados
                </Text>
              }
            />
          )}
        </Box>
      )}
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
    fontSize: 20,
    fontWeight: '500',
    marginTop: 15,
  },
});
