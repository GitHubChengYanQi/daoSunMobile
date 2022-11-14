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
import { getInType } from '../../../Work/CreateTask/components/InstockAsk';
import { getOutType } from '../../../Work/CreateTask/components/OutstockAsk';
import { useHistory } from 'react-router-dom';

export const instockOrderCountViewByUser = { url: '/statisticalView/instockOrderCountViewByUser', method: 'POST' };
export const instockDetailBySpuClass = { url: '/statisticalView/instockDetailBySpuClass', method: 'POST' };
export const instockDetailByCustomer = { url: '/statisticalView/instockDetailByCustomer', method: 'POST' };

export const outStockDetailView = { url: '/statisticalView/outStockDetailView', method: 'POST' };
export const outStockDetailBySpuClass = { url: '/statisticalView/outStockDetailBySpuClass', method: 'POST' };
export const outstockDetailByCustomer = { url: '/statisticalView/outstockDetailByCustomer', method: 'POST' };

const Ranking = (
  {
    date = [],
    fontSize,
    title,
    modal,
    buttons = [],
    noIcon,
    askNumber,
    useNumber,
  },
) => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const {
    loading: instockLogViewLoading,
    run: instockOrderCountViewByUserRun,
  } = useRequest(instockOrderCountViewByUser, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.orderCount || b.inNumCount || 0) - (a.orderCount || a.inNumCount || 0)));
    },
  });

  const {
    loading: outStockDetailViewLoading,
    run: outStockDetailViewrRun,
  } = useRequest(outStockDetailView, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.outNumCount || b.orderCount || 0) - (a.outNumCount || a.orderCount || 0)));
    },
  });

  const {
    loading: instockDetailBySpuClassLoading,
    run: instockDetailBySpuClassRun,
  } = useRequest(instockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.inNumCount || 0) - (a.inNumCount || 0)));
    },
  });

  const {
    loading: instockDetailByCustomerLoading,
    run: instockDetailByCustomerRun,
  } = useRequest(instockDetailByCustomer, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res));
    },
  });

  const {
    loading: outStockDetailBySpuClassLoading,
    run: outStockDetailBySpuClassRun,
  } = useRequest(outStockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.outNumCount || 0) - (a.outNumCount || 0)));
    },
  });

  const {
    loading: outstockDetailByCustomerLoading,
    run: outstockDetailByCustomerRun,
  } = useRequest(outstockDetailByCustomer, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.outNumCount || 0) - (a.outNumCount || 0)));
    },
  });

  const [type, setType] = useState(buttons[0].key);

  const getData = (searchType) => {
    switch (modal) {
      case 'inAskNumber':
        instockOrderCountViewByUserRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'supply':
        instockDetailByCustomerRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'inStockNumber':
        instockDetailBySpuClassRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;

      case 'outAskNumber':
        outStockDetailViewrRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'outStockNumber':
        outStockDetailBySpuClassRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      case 'useNumber':
        outstockDetailByCustomerRun({ data: { searchType, beginTime: date[0], endTime: date[1] } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData(type);
  }, [modal, date[0], date[1]]);

  if (
    instockLogViewLoading ||
    instockDetailBySpuClassLoading ||
    instockDetailByCustomerLoading ||
    outStockDetailViewLoading ||
    outStockDetailBySpuClassLoading ||
    outstockDetailByCustomerLoading
  ) {
    return <MyLoading skeleton />;
  }

  return <div className={classNames(styles.card, styles.askNumber)}>
    <div className={styles.askNumberHeader}>
      <div className={styles.askNumberHeaderLabel} style={{ fontSize }}>
        <Icon hidden={noIcon} type='icon-rukuzongshu' />
        {title}
      </div>
      <div onClick={() => {
        history.push({
          pathname: '/Report/ReportDetail',
          search:`type=${modal}`,
        });
      }}>
        <span hidden={!askNumber}>共 <span className='numberBlue'>{list.length}</span>人 </span>
        <span hidden={!useNumber}>共 <span className='numberBlue'>108</span>家 </span>
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
          case 'ORDER_BY_CREATE_USER':
            leftText = <UserName user={item.userResult} />;
            rightText = `${item.orderCount || 0} 次`;
            break;
          case 'PICK_USER':
          case 'ORDER_BY_DETAIL':
            leftText = <UserName user={item.userResult} />;
            rightText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'SKU_COUNT':
          case 'NUM_COUNT':
            leftText = item.customerName || '无供应商';
            rightText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
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
