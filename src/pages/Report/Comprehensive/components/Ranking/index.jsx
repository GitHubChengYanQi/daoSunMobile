import React, { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { classNames, isArray } from '../../../../components/ToolUtil';
import { Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { instockDetailBySpuClass } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';
import { getInType } from '../../../../Work/CreateTask/components/InstockAsk';
import { getOutType } from '../../../../Work/CreateTask/components/OutstockAsk';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';

const Ranking = () => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '入库', key: 'SPU_CLASS' },
    { title: '出库', key: 'TYPE' },
    { title: '盘点', key: 'STOREHOUSE' },
    { title: '养护', key: '1' },
    { title: '调拨', key: '2' },
  ];

  const [type, setType] = useState(types[0].key);

  useEffect(() => {

  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle}>
        <Icon type='icon-rukuzongshu' />
        执行数量排行
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=inStockNumber',
      })}>
        <RightOutline />
      </div>
    </div>
    <div className={styles.rankingScreen} style={{ justifyContent: 'center' }}>
      {
        types.map((item, index) => {
          return <Button
            style={{padding:'4px 12px'}}
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

export default Ranking;
