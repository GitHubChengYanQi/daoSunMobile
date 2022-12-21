import React from 'react';
import styles from './index.less';
import { Button, Space } from 'antd-mobile';
import MyRadio from '../MyRadio';

const CheckAllExport = (
  {
    pageAll,
    onPageAll = () => {
    },
    checkAll,
    onCheckAll = () => {
    },
    onExport = () => {
    },
  },
) => {


  return <>
    <div className={styles.bottomAction}>
      <Space className={styles.radio}>
        <MyRadio checked={pageAll} onChange={() => {
          onCheckAll(false);
          onPageAll(true);
        }}>本页全选</MyRadio>
        <MyRadio checked={checkAll} onChange={() => {
          onPageAll(false);
          onCheckAll(true);
        }}>全部全选</MyRadio>
      </Space>

      <Button color='primary' onClick={() => {
        onExport(true);
        // exportRun({ data: { beginTime: date[0], endTime: date[1] } });
      }}>
        导出
      </Button>
    </div>
  </>;
};

export default CheckAllExport;
