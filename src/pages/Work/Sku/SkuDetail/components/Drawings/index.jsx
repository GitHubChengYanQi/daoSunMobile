import React from 'react';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import { Space } from 'antd-mobile';
import styles from '../../index.less';
import { Avatar } from 'antd';
import MyEllipsis from '../../../../../components/MyEllipsis';
import UploadFile from '../../../../../components/Upload/UploadFile';
import { isArray } from '../../../../../components/ToolUtil';

export const skuDrawings = { url: '/sku/getSkuDrawing', method: 'GET' };

const Drawings = ({ skuId }) => {

  const { loading, data } = useRequest({ ...skuDrawings, params: { skuId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (isArray(data).length === 0) {
    return <></>;
  }

  return <div className={styles.files}>
    <div className={styles.title}>图纸</div>
    <UploadFile files={data} show file fileRender={(item) => {
      return <Space direction='vertical' style={{ width: 80, margin: '0 12px' }}>
        <div className={styles.fileItem}>
          <Avatar shape='square' size={80} src={item.url} className={styles.showImg} icon={item.icon} />
        </div>
        <MyEllipsis width={80}>{item.filedName || item.url}</MyEllipsis>
      </Space>;
    }} />
  </div>;
};

export default Drawings;
