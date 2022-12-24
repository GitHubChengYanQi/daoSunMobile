import React, { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { MyLoading } from '../../../../components/MyLoading';

export const stockNumberView = { url: '/statisticalView/stockNumberView', method: 'POST' };

const NumberRanking = () => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '物料分类', key: 'SPU_CLASS' },
    { title: '仓库', key: 'STOREHOUSE' },
    { title: '材质', key: 'MATERIAL' },
    { title: '供应商', key: 'CUSTOMER' },
  ];

  const [type, setType] = useState(types[0].key);

  const {
    loading,
    run,
  } = useRequest(stockNumberView, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res));
    },
  });

  useEffect(() => {
    run({ data: { searchType: type } });
  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle}>
        <Icon type='icon-rukuzongshu' />
        库存数量排行
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=stockRanking',
      })}>
        <RightOutline />
      </div>
    </div>
    <div className={styles.rankingScreen}>
      排行方式
      {
        types.map((item, index) => {
          return <Button
            key={index}
            color='primary'
            fill={type === item.key ? '' : 'outline'}
            onClick={() => setType(item.key)}
          >
            {item.title}
          </Button>;
        })
      }
    </div>
    {list.length === 0 && <MyEmpty />}
    {
      loading ? <MyLoading skeleton /> : list.map((item, index) => {
        if (index > 2) {
          return;
        }
        let leftText = '';
        switch (type) {
          case 'SPU_CLASS':
            leftText = item.className || '无分类';
            break;
          case 'STOREHOUSE':
            leftText = item.storehouseName || '无仓库';
            break;
          case 'MATERIAL':
            leftText = item.materialName || '无材质';
            break;
          case 'CUSTOMER':
            leftText = item.customerName || '无供应商';
            break;
          default:
            break;
        }
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{leftText}</div>
          {`${item.skuCount || 0} 类 ${item.number || 0} 件`}
        </div>;
      })
    }
  </>;
};

export default NumberRanking;
