import { DotLoading, Toast } from 'antd-mobile';
import { useEffect } from 'react';

export const MyLoading = ({ title }) => {

  useEffect(() => {
    Toast.show({
      icon: 'loading',
      duration: 0,
      content: <>{title || 'Loading'}<DotLoading /></>,
    });
    return () => {
      Toast.clear();
    };
  }, []);

  return null;
};
