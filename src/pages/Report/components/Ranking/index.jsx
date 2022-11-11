import React, { useEffect, useState } from 'react';
import styles from '../../InStockReport/index.less';
import { CaretUpFilled } from '@ant-design/icons';
import { RightOutline } from 'antd-mobile-icons';
import { classNames, isArray } from '../../../components/ToolUtil';
import { Button } from 'antd-mobile';
import Icon from '../../../components/Icon';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { UserName } from '../../../components/User';

export const instockOrderCountViewByUser = { url: '/statisticalView/instockOrderCountViewByUser', method: 'POST' };
export const instockDetailBySpuClass = { url: '/statisticalView/instockDetailBySpuClass', method: 'POST' };
export const instockView = { url: '/statisticalView/instockView', method: 'POST' };

const Ranking = (
  {
    date = [],
    fontSize,
    title,
    modal,
    buttons = [],
    noIcon,
  },
) => {

  const [list, setList] = useState([]);

  const {
    loading: instockLogViewLoading,
    run: instockOrderCountViewByUserRun,
  } = useRequest(instockOrderCountViewByUser, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.orderCount || b.inNumCount) - (a.orderCount || a.inNumCount)));
    },
  });

  const {
    loading: instockDetailBySpuClassLoading,
    run: instockDetailBySpuClassRun,
  } = useRequest(instockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      // console.log(res);
      setList(isArray(res).sort((a, b) => (b.inNumCount) - (a.inNumCount)));
    },
  });

  const {
    loading: instockViewLoading,
    run: instockViewRun,
  } = useRequest(instockView, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.logNumberCount) - (a.logNumberCount)));
    },
  });

  const [type, setType] = useState(buttons[0].key);

  const getData = (searchType) => {
    switch (modal) {
      case 'inAskNumber':
        instockOrderCountViewByUserRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'supply':
        instockViewRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'inStockNumber':
        instockDetailBySpuClassRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [modal, date[0], date[1]]);

  if (instockLogViewLoading || instockDetailBySpuClassLoading || instockViewLoading) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.askNumber)}>
    <div className={styles.askNumberHeader}>
      <div className={styles.askNumberHeaderLabel} style={{ fontSize }}>
        <Icon hidden={noIcon} type='icon-rukuzongshu' />
        {title}
      </div>
      <div>
        <span hidden={modal !== 'inAskNumber'}>共 <span className='numberBlue'>{list.length}</span>人 </span>
        <span hidden={modal !== 'useNumber'}>共 <span className='numberBlue'>108</span>家 </span>
        <RightOutline />
      </div>
    </div>

    {
      list.map((item, index) => {
        if (index > 2) {
          return;
        }
        let leftText = '';
        let rightText = '';
        switch (type) {
          case 'outAskNumberTask':
          case 'ORDER_BY_CREATE_USER':
            leftText = <UserName user={item.userResult} />;
            rightText = `${item.orderCount || 0} 次`;
            break;
          case 'outAskNumberSku':
          case 'ORDER_BY_DETAIL':
            leftText = <UserName user={item.userResult} />;
            rightText = `${item.inSkuCount || 0} 类 ${item.inNumCount || 0} 件`;
            break;
          case 'useClass':
          case 'useNumber':
          case 'supplyClass':
          case 'supplyNumber':
            leftText = item.customerName;
            rightText = `${item.logSkuCount || 0} 类 ${item.logNumberCount || 0} 件`;
            break;
          case 'outStockClass':
          case 'SPU_CLASS':
            leftText = item.spuClassName;
            rightText = `${item.inSkuCount || 0} 类 ${item.inNumCount || 0} 件`;
            break;
          case 'outStockType':
          case 'TYPE':
            leftText = '物料采购';
            rightText = '16 类 122 件';
            break;
          case 'outStockHouse':
          case 'STOREHOUSE':
            leftText = '南坡大库';
            rightText = '16 类 122 件';
            break;
          case 'outStockUser':
            leftText = '张三（生产制造部-装配工）';
            rightText = '16 类 122 件';
            break;
          default:
            break;
        }
        return <div key={index} className={styles.askNumberContent}>
          <div className={styles.askNumberContenLabel}>{leftText}</div>
          {rightText}
        </div>;
      })
    }

    <div className={styles.askNumberButtons}>
      {
        buttons.map((item, index) => {
          return <Button
            key={index}
            color={type === item.key ? 'primary' : 'default'}
            onClick={() => {
              getData(item.key);
              setType(item.key);
            }}
          >
            <CaretUpFilled hidden={type !== item.key} className={styles.icon} />
            {item.title}
          </Button>;
        })
      }
    </div>
  </div>;
};

export default Ranking;
