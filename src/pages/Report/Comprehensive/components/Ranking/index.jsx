import React, { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { classNames, isArray } from '../../../../../util/ToolUtil';
import { Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';
import { UserName } from '../../../../components/User';
import { MyLoading } from '../../../../components/MyLoading';

export const taskLogUserViewDetail = {
  url: '/statisticalView/taskLogUserViewDetail',
  method: 'POST',
};

const Ranking = () => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '入库', key: 'INSTOCK' },
    { title: '出库', key: 'OUTSTOCK' },
    { title: '盘点', key: 'INVENTORY' },
    { title: '养护', key: 'MAINTENANCE' },
    { title: '调拨', key: 'ALLOCATION' },
  ];

  const [type, setType] = useState(types[0].key);

  const {
    loading,
    data,
    run,
  } = useRequest(taskLogUserViewDetail, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setList(isArray(res));
    },
  });

  useEffect(() => {
    run({ data: { searchType: type } });
  }, [type]);

  if (!data) {
    if (loading) {
      return <MyLoading skeleton />;
    }
  }

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle}>
        <Icon type='icon-rukuzongshu' />
        执行数量排行
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=executeNumber',
      })}>
        <RightOutline />
      </div>
    </div>
    <div className={styles.rankingScreen} style={{ justifyContent: 'center' }}>
      {
        types.map((item, index) => {
          return <Button
            style={{ padding: '4px 12px' }}
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
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;<UserName user={item.userResult} /></div>
          {`${item.skuCount || item.outSkuCount || 0} 类 ${item.numCount || item.outNumCount || 0} 件`}
        </div>;
      })
    }

    {loading && <MyLoading />}
  </>;
};

export default Ranking;
