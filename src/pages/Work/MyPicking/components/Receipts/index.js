import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MyList from '../../../../components/MyList';
import { orderList } from '../../../Order/Url';
import style from '../../../Instock/InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { DownOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../../Sku/SkuItem';
import {  Divider } from 'antd-mobile';
import ShopNumber from '../../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyCheck from '../../../../components/MyCheck';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

const getCarts = {url:'/productionPickListsCart/getSelfCartsByLists',method:'POST'}

const Receipts = (
  {
    getCount = () => {
    },
  },
) => {

  const [data, setData] = useState([]);

  console.log(data);

  const history = useHistory();

  const submitRef = useRef();

  const {loading,run} = useRequest(getCarts,{
    manual:true,
    onSuccess:(res)=>{
      setData(ToolUtil.isArray(res));
    }
  });

  useEffect(()=>{
    run();
  },[])

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

      {
        data.map((item, index) => {
          const skus = item.cartResults || [];

          const createTime = new Date(item.createTime);

          return <div key={index} className={style.orderItem}>
            <div className={style.data}>
              <div className={style.customer}>
                <MyCheck fontSize={18} />{ToolUtil.isObject(item.bcustomer).customerName} <RightOutline style={{ color: '#B9B9B9' }} />
              </div>
              <div className={style.status} style={{color:'#555555'}}>
                备料人:xxx
              </div>
            </div>
            {
              skus.map((skuItem, skuIndex) => {
                if (!item.allSku && skuIndex > 0) {
                  return null;
                }
                return <div key={skuIndex} className={style.skus}>
                  <span className={style.checked}><MyCheck fontSize={18} /></span>
                  <div className={style.skuItem}>
                    <SkuItem
                      imgSize={60}
                      skuResult={skuItem.skuResult}
                      extraWidth='158px'
                      otherData={ToolUtil.isObject(skuItem.brandResult).brandName}
                    />
                  </div>
                  <div className={style.skuData} style={{width:100,maxWidth:100}}>
                    <div className={style.time}>
                        <div className={style.left}>{createTime.getMonth()}</div>
                        <div className={style.slash} />
                        <div className={style.right}>{createTime.getDay()}</div>
                    </div>
                    <div className={style.skuDataMoney}>
                      <ShopNumber value={12} />
                    </div>
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

            </div>
          </div>;
        })
      }

    {loading && <MyLoading />}
  </>;
};

export default Receipts;
