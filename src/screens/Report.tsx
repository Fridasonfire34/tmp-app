import React, {useEffect, useState} from 'react';
import {Button, Dimensions, Platform, StyleSheet} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {Box, Stack, useToast} from 'native-base';
import RNFetchBlob from 'react-native-blob-util';
import Pdf from 'react-native-pdf';

export default function Report() {
  const [uri, setUri] = useState<any>(null);

  const route = useRoute();
  const {source}: any = route.params;

  const toast = useToast();

  const handleShare = async () => {
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

  useEffect(() => {
    if (source) {
      setUri(`data:application/pdf;base64,${source}`);
    }
  }, [source]);

  if (!uri) {
    return null;
  }

  return (
    <Box style={styles.container}>
      <Stack justifyContent="flex-end">
        <Button onPress={handleShare} title="Compartir" />
      </Stack>
      <Pdf
        source={{
          uri: uri,
        }}
        trustAllCerts={Platform.OS === 'ios'}
        onLoadComplete={(numberOfPages, _) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, _) => {
          console.log(`current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={url => {
          console.log(`Link presse: ${url}`);
        }}
        style={styles.pdf}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
