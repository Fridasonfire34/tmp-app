import React from 'react';
import {NativeBaseProvider, Box} from 'native-base';
import Layout from '@app/components/layout';

export default function App() {
  return (
    <NativeBaseProvider>
      <Layout>
        <Box>Hello world</Box>
      </Layout>
    </NativeBaseProvider>
  );
}
