import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import MyNavBar from '../../../components/MyNavBar';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Checkbox, List, Toast } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResult_skuJsons, { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import BottomButton from '../../../components/BottomButton';
import { productionPickListsCreateOutOrder } from '../components/Url';
import Icon from '../../../components/Icon';

const MyCart = (porps) => {

  const [carts, setCarts] = useState([]);
  console.log(carts);

  const { loading, data, refresh } = useRequest({
    url: '/productionPickListsCart/getSelfCarts',
    method: 'POST',
  });


  const { loading: outLoading, run: outstock } = useRequest(productionPickListsCreateOutOrder, {
    manual: true,
    onSuccess: () => {
      refresh();
      setCarts([]);
      Toast.show({
        content: '出库成功！',
        position: 'bottom',
      });
    },
    onError: () => {
      Toast.show({
        content: '出库失败！',
        position: 'bottom',
      });
    },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data || data.length === 0) {
    return <div>
      <MyNavBar title='我的领料' />
      <MyEmpty description='暂无待领取物料' />
    </div>;
  }

  const skuChecked = (checked, cartItem) => {
    if (checked) {
      setCarts([...carts, cartItem]);
    } else {
      const array = carts.filter((item) => {
        return item.pickListsCart !== cartItem.pickListsCart;
      });
      setCarts(array);
    }
  };

  const getKey = (key) => {
    return carts.map(item => item.pickListsCart).includes(key);
  };

  return <>
    <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 99 }}>
      <MyNavBar title='我的领料' />
    </div>

    <div style={{ marginBottom: 60 }}>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          data.map((item, index) => {
            const skuResult = item.skuResult || {};
            return <List.Item
              key={index}
              arrow={false}
              extra={`× ${item.number}`}
              onClick={() => {
                skuChecked(!getKey(item.pickListsCart), item);
              }}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                  <Checkbox
                    checked={getKey(item.pickListsCart)}
                    icon={checked =>
                      checked ? <Icon type='icon-duoxuanxuanzhong1' /> : <Icon type='icon-a-44-110' />
                    }
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <MyEllipsis>
                    {SkuResultSkuJsons({ skuResult })}</MyEllipsis>
                  <div style={{ display: 'flex', fontSize: 14 }}>
                    <Label>描述：</Label>
                    <MyEllipsis
                      width='60%'
                      smallFont
                    >{SkuResultSkuJsons({ skuResult,describe:true })}</MyEllipsis>
                  </div>
                </div>
              </div>

            </List.Item>;
          })
        }
      </List>
    </div>

    <BottomButton
      leftText={carts.length === data.length ? '取消全选' : '全选'}
      leftOnClick={() => {
        if (carts.length === data.length) {
          setCarts([]);
        } else {
          setCarts(data);
        }
      }}
      rightDisabled={carts.length === 0}
      rightText='领取'
      rightOnClick={() => {
        outstock({
          data: {
            pickListsDetailParams: carts,
          },
        });
      }}
    />

    {outLoading && <MyLoading />}

  </>;

};

export default MyCart;
