import React from 'react';
import {SafeAreaView} from 'react-native';

import {Box} from 'native-base';

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SafeAreaView>
      <Box px={3} py={2}>
        {children}
      </Box>
    </SafeAreaView>
  );
};

export default Layout;
