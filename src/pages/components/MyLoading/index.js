import { Toast } from 'antd-mobile';
import { useEffect } from 'react';

export const MyLoading = ({ loading,title }) => {

  useEffect(() => {
    if (loading){
      Toast.show({
        icon: 'loading',
        duration: 0,
        content: title || '加载中…',
      });
    }else {
      Toast.clear();
    }
  }, [loading]);

  return <></>;
};
