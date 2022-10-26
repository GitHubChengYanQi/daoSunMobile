import React, { useRef, useState } from 'react';
import MySearch from '../../../../../components/MySearch';
import MyList from '../../../../../components/MyList';
import { RightOutline } from 'antd-mobile-icons';
import styles from './index.less';
import { classNames } from '../../../../../components/ToolUtil';
import LinkButton from '../../../../../components/LinkButton';
import { history } from 'umi';
import SkuLogScreen from './components/SkuLogScreen';
import { ReceiptsEnums } from '../../../../../Receipts';

export const skuHandleRecord = { url: '/skuHandleRecord/list', method: 'POST' };

const SkuLog = ({ skuId }) => {

  const defaultParams = { skuId };

  const ref = useRef();

  const [loading, setLoading] = useState(false);

  const [screen, setScreen] = useState();
  const [screening, setScreeing] = useState();
  const [params, setParams] = useState(defaultParams);
  const [number, setNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  const submit = (data = {}) => {
    const newParams = { ...params, ...data };
    setParams(newParams);
  };

  const clear = () => {
    setParams(defaultParams);
  };

  return <div style={{ height: open ? '90vh' : 'auto' }}>
    <MySearch extraIcon={<LinkButton onClick={() => {
      setOpen(true);
      setScreen(true);
    }}>筛选</LinkButton>} />
    <div className={styles.space} style={{ height: 1 }} />
    <MyList
      pullDisabled
      response={(res) => {
        setNumber(res.count);
      }}
      ref={ref}
      onLoading={setLoading}
      api={skuHandleRecord}
      params={defaultParams}
      data={data}
      getData={setData}
    >
      {
        data.map((item, index) => {
          let typeName = '';
          let balanceNumber;

          switch (item.source) {
            case ReceiptsEnums.instockOrder:
              typeName = '入库';
              balanceNumber = item.balanceNumber;
              break;
            case ReceiptsEnums.outstockOrder:
              typeName = '出库';
              balanceNumber = item.balanceNumber;
              break;
            case ReceiptsEnums.stocktaking:
              typeName = '盘点';
              break;
            case ReceiptsEnums.maintenance:
              typeName = '养护';
              break;
            case ReceiptsEnums.allocation:
              typeName = '调拨';
              break;
            default:
              break;
          }
          return <div key={index} className={styles.logItem}>
            <div className={styles.flexCenter}>
              <div className={classNames(styles.flexGrow)}>
                <span className={styles.type}>· {typeName}</span> ×{item.operationNumber}
                <span style={{ marginLeft: 8 }} hidden={!balanceNumber}>结余：{balanceNumber}</span>
              </div>
              <div>{item.brandResult?.brandName || '无品牌'}</div>
            </div>
            <div className={classNames(styles.flexCenter, styles.info)}>
              <div className={classNames(styles.flexGrow)}>
                {item.positionsResult?.name || '-'} / {item.positionsResult?.storehouseResult?.name || '-'}
              </div>
              <div>人/时间</div>
            </div>
            <div style={{ padding: '8px 0' }} onClick={() => {
              history.push(`/Receipts/ReceiptsDetail?id=${item.taskId}`);
            }}>来源：{item.theme}<RightOutline /></div>
            <div className={styles.space} />
          </div>;
        })
      }
    </MyList>

    <SkuLogScreen
      loading={loading}
      screen={screen}
      skuNumber={number}
      params={params}
      afterClose={() => {
        setOpen(false);
      }}
      onClose={() => {
        // skuListRef.current.removeAttribute('style');
        setScreen(false);
      }}
      onChange={(value) => {
        setScreeing(true);
        submit({ ...value });
      }}
      onClear={clear}
    />
  </div>;
};

export default SkuLog;
