import React from 'react';

import Layout from '@app/components/layout';
import {Box, NativeBaseProvider} from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <Layout>
        <Box>Hello world</Box>
      </Layout>
    </NativeBaseProvider>
  );
}
