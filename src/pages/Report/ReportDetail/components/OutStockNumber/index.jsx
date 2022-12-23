import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyEllipsis from '../../../../components/MyEllipsis';
import { outStockDetailBySpuClass } from '../../../components/Ranking';
import MyList from '../../../../components/MyList';
import { getInType } from '../../../../Work/CreateTask/components/InstockAsk';
import { getOutType } from '../../../../Work/CreateTask/components/OutstockAsk';
import { UserName } from '../../../../components/User';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

export const outBySkuClass = { url: '/statisticalView/outBySku', method: 'POST' };

const OutStockNumber = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const [skus, setSkus] = useState([]);

  const {
    loading: outBySkuClassLoading,
    run: outBySkuClassRun,
  } = useRequest(outBySkuClass, {
    manual: true,
    onSuccess: (res) => {
      setSkus(res);
    },
  });

  return <MyList manual ref={listRef} api={outStockDetailBySpuClass} data={list} getData={setList}>
    {
      list.map((item, index) => {
        let title;
        let numberText;
        switch (params.searchType) {
          case 'SPU_CLASS':
            title = item.spuClassName || '无分类';
            numberText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'TYPE':
            title = getInType(item.type) || getOutType(item.type) || '无类型';
            numberText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'STOREHOUSE':
            title = item.storehouseName || '无仓库';
            numberText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          case 'PICK_USER':
            title = <UserName user={item.userResult} />;
            numberText = `${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`;
            break;
          default:
            break;
        }
        const show = open === index;

        return <div key={index} className={styles.listItem}>
          <div className={styles.header}>
            <MyCheck fontSize={17} />
            <div className={styles.label}><MyEllipsis>{title}</MyEllipsis></div>
            <div onClick={() => {
              setOpen(show ? undefined : index);
              if (show) {
                return;
              }
              switch (params.searchType) {
                case 'SPU_CLASS':
                  outBySkuClassRun({ data: { spuClassId: item.spuClassId } });
                  break;
                case 'TYPE':

                  break;
                case 'STOREHOUSE':

                  break;
                case 'PICK_USER':

                  break;
                default:
                  break;
              }
            }}>{numberText}&nbsp;&nbsp;{!show ? <DownOutline /> : <UpOutline />}</div>
          </div>
          <div className={styles.content} hidden={!show}>
            {
              outBySkuClassLoading ? <MyLoading skeleton /> : skus.map((item, index) => {
                return <div key={index} className={styles.skuItem}>
                  <SkuItem
                    skuResult={item.skuResult}
                    className={styles.sku}
                    extraWidth='124px'
                  />
                  <div style={{ textAlign: 'right' }}>
                    <ShopNumber show value={item.number} />
                  </div>
                </div>;
              })
            }
          </div>
          <div className={styles.space} />
        </div>;
      })
    }
  </MyList>;
};

export default OutStockNumber;
