import React, { useEffect, useState } from 'react';
import { isArray } from '../../../../../util/ToolUtil';
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

const NumberRanking = ({ title }) => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '物料分类', key: 'SPU_CLASS' },
    { title: '任务类型', key: 'TYPE' },
    { title: '仓库', key: 'STOREHOUSE' },
    { title: '养护人员', key: 'USER' },
  ];

  const [type, setType] = useState(types[0].key);

  const {
    loading: instockDetailBySpuClassLoading,
    run: instockDetailBySpuClassRun,
  } = useRequest(instockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.inNumCount || 0) - (a.inNumCount || 0)));
    },
  });

  useEffect(() => {
    instockDetailBySpuClassRun({ data: { searchType: type } });
  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle} style={{ fontSize: 16 }}>
        {title}
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=inStockNumber',
      })}>
        共 <span className='numberBlue'>{0}</span>类
        共 <span className='numberBlue'>{0}</span>件
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
      instockDetailBySpuClassLoading ? <MyLoading skeleton /> : list.map((item, index) => {
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
