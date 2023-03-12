import React, {useEffect} from 'react';

import Layout from '@app/components/layout';
import {fetchUser} from '@app/redux/slices/signInSlice';
import {useAppDispatch, useAppSelector} from '@app/redux/store';
import {Box} from 'native-base';

export default function Home() {
  const dispatch = useAppDispatch();
  const {user, error, loading} = useAppSelector(state => state.signIn);

  useEffect(() => {
    dispatch(
      fetchUser({
        email: 'admin@tmp.com',
        password: 'M0nd4y$44',
      }),
    );
  }, [dispatch]);

  console.log('user', user);
  console.log('error', error);
  console.log('loading', loading);

  return (
    <Layout>
      <Box>Hello world</Box>
    </Layout>
  );
}
