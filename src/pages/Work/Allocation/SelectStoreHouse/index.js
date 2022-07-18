import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { shopCartApplyList } from '../../Instock/Url';
import { ToolUtil } from '../../../components/ToolUtil';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';
import style from './index.less';
import { ERPEnums } from '../../Stock/ERPEnums';
import LinkButton from '../../../components/LinkButton';
import BottomButton from '../../../components/BottomButton';
import { useHistory } from 'react-router-dom';

export const selectStoreHouse = { url: '/stockDetails/getStockAndNumberBySkuId', method: 'POST' };

const SelectStoreHouse = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const { loading: storeLoading, run: getStoreHouse } = useRequest(selectStoreHouse, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
    },
  });

  const { loading: shopLoading } = useRequest({
    ...shopCartApplyList,
    data: {
      type: ERPEnums.allocation,
    },
  }, {
    onSuccess: (res) => {
      setData(ToolUtil.isArray(res).map((item) => {
        return {
          cartId: item.cartId,
          skuId: item.skuId,
          skuResult: item.skuResult,
          brandName: ToolUtil.isObject(item.brandResult).brandName,
          brandId: item.brandId,
          number: item.number,
        };
      }));
    },
  });

  const dataChange = (cartId, params) => {
    const newData = data.map(item => {
      if (item.cartId === cartId) {
        return { ...item, ...params };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  if (shopLoading) {
    return <MyLoading skeleton />;
  }

  return <div style={{ paddingBottom: 60 }}>
    <MyNavBar title='选择调出仓库' />
    <MyCard title='多仓库物料选择'>
      {
        data.map((item, index) => {
          return <div key={index} className={style.SkuItem} style={{ border: index === data.length - 1 && 'none' }}>
            <div className={style.sku}>
              <SkuItem skuResult={item.skuResult} otherData={[item.brandName || '任意品牌']} extraWidth='140px' />
            </div>
            <div className={style.action}>
              <ShopNumber value={item.number} onChange={number => {
                dataChange(item.cartId, { number });
              }} />
              <Button color='primary' fill='outline' onClick={() => {
                getStoreHouse({ data: { skuId: item.skuId } });
              }}>选择仓库</Button>
            </div>
          </div>;
        })
      }
    </MyCard>

    <MyCard title='南坡大库'>
      {
        data.map((item, index) => {
          return <div key={index} className={style.SkuItem} style={{ border: index === data.length - 1 && 'none' }}>
            <div className={style.sku}>
              <SkuItem extraWidth='140px' skuResult={item.skuResult} otherData={[item.brandName || '任意品牌']} />
            </div>
            <div className={style.newAction}>
              <LinkButton color='danger'>重新选择</LinkButton>
              <ShopNumber value={item.number} onChange={number => {
                dataChange(item.cartId, { number });
              }} />
            </div>
          </div>;
        })
      }
    </MyCard>

    <BottomButton
      rightText='下一步'
      leftOnClick={() => {
        history.goBack();
      }}
      rightOnClick={() => {
        history.push({
          pathname: '/Work/Instock/InstockAsk/Submit',
          query: {
            createType: ERPEnums.allocation,
          },
          state: {
            skus: data,
          },
        });
      }}
    />
  </div>;
};

export default SelectStoreHouse;
