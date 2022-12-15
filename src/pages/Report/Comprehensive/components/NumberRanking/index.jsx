import React, { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { getInType } from '../../../../Work/CreateTask/components/InstockAsk';
import { getOutType } from '../../../../Work/CreateTask/components/OutstockAsk';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';

const NumberRanking = () => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '物料分类', key: '0' },
    { title: '仓库', key: '1' },
    { title: '材质', key: '2' },
    { title: '供应商', key: '3' },
  ];

  const [type, setType] = useState(types[0].key);

  useEffect(() => {

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
      list.map((item, index) => {
        if (index > 2) {
          return;
        }
        let leftText = '';
        let rightText = '';
        switch (type) {
          case 'SPU_CLASS':
            leftText = item.spuClassName || '无分类';
            rightText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'TYPE':
            leftText = getInType(item.type) || getOutType(item.type) || '无类型';
            rightText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'STOREHOUSE':
            leftText = item.storehouseName || '无仓库';
            rightText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          default:
            break;
        }
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{leftText}</div>
          {rightText}
        </div>;
      })
    }
  </>;
};

export default NumberRanking;
