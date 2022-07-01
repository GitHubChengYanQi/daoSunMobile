import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import MyList from '../../components/MyList';
import style from '../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { ToolUtil } from '../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../Sku/SkuItem';
import { Divider } from 'antd-mobile';

export const orderList = { url: '/anomalyOrder/list', method: 'POST' };

const Error = () => {

  const [data, setData] = useState([]);

  const dataChange = (dataItem, itemIndex) => {
    const newData = data.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, ...dataItem };
      }
      return item;
    });
    setData(newData);
  };

  return <>

    <MyNavBar title='异常处理' />

    <MySearch />

    <MyList
      api={orderList}
      data={data}
      getData={setData}
    >
      {
        data.map((item, index) => {

          const skus = [1, 2, 3];

          return <div key={index} className={style.orderItem}>
            <div className={style.data}>
              <div className={style.customer}>
                入库异常 / {item.coding}
              </div>
              <div className={style.status}>
                · {item.statusName}
              </div>
            </div>
            {
              skus.map((skuItem, skuIndex) => {
                if (!item.allSku && skuIndex > 0) {
                  return null;
                }
                return <div key={skuIndex} className={style.skus}>
                  <div className={style.skuItem}>
                    <SkuItem
                      imgSize={60}
                      skuResult={skuItem.skuResult}
                      extraWidth='24px'
                      otherData={[ToolUtil.isObject(skuItem.brandResult).brandName]}
                    />
                  </div>
                </div>;
              })
            }
            {skus.length > 1 && <Divider className={style.allSku}>
              <div onClick={() => {
                dataChange({ allSku: !item.allSku }, index);
              }}>
                {
                  item.allSku ?
                    <UpOutline />
                    :
                    <DownOutline />
                }
              </div>
            </Divider>}
            <div className={style.data}>
              关联单据 xxx的入库单
            </div>
          </div>;
        })
      }
    </MyList>

  </>;
};

export default Error;
