import React from 'react';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import { Space } from 'antd-mobile';
import styles from '../../index.less';
import { Avatar } from 'antd';
import MyEllipsis from '../../../../../components/MyEllipsis';
import UploadFile from '../../../../../components/Upload/UploadFile';
import { isArray } from '../../../../../components/ToolUtil';

export const skuFiles = { url: '/sku/getSkuFile', method: 'GET' };

const Files = ({ skuId }) => {

  const { loading, data } = useRequest({ ...skuFiles, params: { skuId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (isArray(data).length === 0) {
    return <></>;
  }

  return <div className={styles.files}>
    <div className={styles.title}>附件</div>
    <UploadFile files={data} show file />
  </div>;
};

export default Files;
