import React, {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';

import {useRoute} from '@react-navigation/native';
import {Box} from 'native-base';
import Pdf from 'react-native-pdf';

export default function Report() {
  const [uri, setUri] = useState<any>(null);

  const route = useRoute();
  const {source}: any = route.params;

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
