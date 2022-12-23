import React, { useState } from 'react';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import MyEllipsis from '../../../../components/MyEllipsis';
import { useRequest } from '../../../../../util/Request';
import MyList from '../../../../components/MyList';
import { stockNumberView } from '../../../Comprehensive/components/NumberRanking';
import MyEmpty from '../../../../components/MyEmpty';
import { MyLoading } from '../../../../components/MyLoading';

export const dataStatisticsViewDetail = { url: '/statisticalView/dataStatisticsViewDetail', method: 'POST', data: {} };

const SkuStock = (
  {
    listRef,
    params = {},
  },
) => {

  const [list, setList] = useState([]);

  const [open, setOpen] = useState();

  const [skus,setSkus] = useState([]);

  const { loading: detailLoaidng, run: detailRun } = useRequest(dataStatisticsViewDetail, {
    manual: true,
    onSuccess: (res) => {
      setSkus(res);
    },
  });

  return <MyList ref={listRef} api={stockNumberView} manual data={list} getData={setList}>
    {
      list.map((item, index) => {
        let title;
        switch (params.searchType) {
          case 'SPU_CLASS':
            title = item.className || '无分类';
            break;
          case 'STOREHOUSE':
            title = item.storehouseName || '无仓库';
            break;
          case 'MATERIAL':
            title = item.materialName || '无材质';
            break;
          case 'CUSTOMER':
            title = item.customerName || '无供应商';
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
                  detailRun({data:{spuClassId:item.spuClassId}});
                  break;
                case 'STOREHOUSE':
                  detailRun({data:{storehouseId:item.storehouseId}});
                  break;
                case 'MATERIAL':
                  detailRun({data:{materialId:item.materialId}});
                  break;
                case 'CUSTOMER':
                  detailRun({data:{customerId:item.customerId}});
                  break;
                default:
                  break;
              }
            }}>
              {`${item.skuCount || 0} 类 ${item.number || 0} 件`}
              &nbsp;&nbsp;{!show ? <DownOutline /> : <UpOutline />}
            </div>
          </div>
          <div className={styles.content} hidden={!show}>
            {!detailLoaidng && skus.length === 0 && <MyEmpty />}
            {
              detailLoaidng ? <MyLoading skeleton /> : skus.map((item, index) => {
                return <div key={index} className={styles.skuItem}>
                  <SkuItem
                    skuResult={item.skuSimpleResult}
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

export default SkuStock;
