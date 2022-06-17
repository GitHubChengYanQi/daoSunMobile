import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MyList from '../../../components/MyList';
import { Button, Divider, Space } from 'antd-mobile';
import { history } from 'umi';
import MySearchBar from '../../../components/MySearchBar';
import MyBottom from '../../../components/MyBottom';
import { ReceiptsEnums } from '../../../Receipts';
import { instockOrderList } from '../../Order/Url';
import style from '../InstockAsk/coponents/ReceiptsInstock/components/PurchaseOrder/index.less';
import { ToolUtil } from '../../../components/ToolUtil';
import { DownOutline, ExclamationCircleOutline, RightOutline, UpOutline } from 'antd-mobile-icons';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { MyDate } from '../../../components/MyDate';

const Orderlist = () => {

  const ref = useRef();

  const [data, setData] = useState([]);

  const dataChange = (param, currentIndex) => {
    const newData = data.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...param };
      }
      return item;
    });
    setData(newData)
  };

  return <>
    <MyBottom
      buttons={<Space>
        <Button color='primary' onClick={() => {
          history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}`);
        }}>新建入库申请</Button>
      </Space>}
    >
      <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}>
        <MyNavBar title='入库单列表' />
        <MySearchBar extra />
      </div>
      <MyList
        ref={ref}
        api={instockOrderList}
        data={data}
        getData={(value) => {
          setData(value.filter(item => item));
        }}>
        {
          data.map((item, index) => {

            const instockListResults = item.instockListResults || [];

            return <div key={index} className={style.orderItem}>
              <div className={style.data}>
                <div className={style.customer}>
                  <span onClick={() => {
                    history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.instockOrder}&formId=${item.instockOrderId}`);
                  }}>{ToolUtil.isObject(item.userResult).name}的入库申请 / {item.coding} <RightOutline
                    style={{ color: '#B9B9B9' }} /></span>
                </div>
                <div className={style.status} style={{ color: '#555555' }}>
                  {MyDate.Show(item.createTime)}
                </div>
              </div>
              {
                instockListResults.map((skuItem, skuIndex) => {

                  if (!item.allSku && skuIndex > 1) {
                    return null;
                  }

                  return <div key={skuIndex} className={style.skus} style={{ alignItems: 'center' }}>
                    <div className={style.skuItem} onClick={() => {

                    }}>
                      <SkuItem
                        imgSize={60}
                        skuResult={skuItem.skuResult}
                        extraWidth='124px'
                        otherData={ToolUtil.isObject(skuItem.customerResult).customerName}
                      />
                    </div>
                    <div className={style.skuData} style={{ width: 100, maxWidth: 100 }}>
                      <ShopNumber value={skuItem.number} show />
                    </div>
                  </div>;
                })
              }
              {instockListResults.length > 2 && <Divider className={style.allSku}>
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
            <span
              className={style.icon}><ExclamationCircleOutline /></span>{ToolUtil.isArray(item.announcementsList).map(item => item.content).join('、')}
              </div>
            </div>;
          })
        }
      </MyList>
    </MyBottom>
  </>;
};

export default Orderlist;
