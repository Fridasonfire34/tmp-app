import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SkypeIndicator} from 'react-native-indicators';

export default function Loading() {
  return (
    <View style={styles.container}>
      <View style={styles.loading}>
        <SkypeIndicator size={50} />
      </View>
      <Text style={styles.text}>Cargando información...</Text>
    </View>
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
    backgroundColor: '#fafafa',
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
