import {Container} from 'native-base';
import React from 'react';
import {SafeAreaView} from 'react-native';

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SafeAreaView>
      <Container>{children}</Container>
    </SafeAreaView>
  );
};

export default Layout;
