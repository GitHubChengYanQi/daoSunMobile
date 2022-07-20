import React, { useEffect, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import { useLocation } from 'react-router-dom';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import style from './index.less';
import SkuItem from '../Sku/SkuItem';
import ShopNumber from '../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import BottomButton from '../../components/BottomButton';
import { Message } from '../../components/Message';
import CodeNumber from './CodeNumber';

const listByCode = { url: '/productionPickLists/listByCode', method: 'GET' };
const outStock = { url: '/productionPickLists/createOutStockOrder', method: 'POST' };

const OutStockConfirm = () => {

  const { query } = useLocation();

  const [outSkus, setOutSkus] = useState([]);

  const [code, setCode] = useState([]);

  const { loading, run } = useRequest(listByCode, {
    manual: true,
    onSuccess: (res) => {
      setOutSkus(res);
    },
  });

  const { loading: outStockLoading, run: outStockRun } = useRequest(outStock, {
    manual: true,
    onSuccess: () => {
      Message.successToast('出库成功！', () => {
          setOutSkus([]);
        },
      );
    },
  });

  useEffect(() => {
    if (query.code) {
      setCode(query.code);
      run({ params: { code: query.code } });
    }
  }, []);

  if (loading || outStockLoading) {
    return <MyLoading />;
  }

  if (outSkus.length === 0) {
    return <div style={{ backgroundColor: '#fff', height: '100%' }}>
      <MyNavBar title='出库确认' />
      <CodeNumber onSuccess={(code) => {
        setCode(code);
        run({ params: { code } });
      }} />
    </div>;
  }

  return <>
    <MyNavBar title='出库确认' />
    <div className={style.skus}>
      {
        outSkus.map((item, index) => {
          return <div key={index} className={style.skuItem}>
            <SkuItem
              className={style.sku}
              extraWidth='74px'
              skuResult={item.skuResult}
              otherData={[item.brandResult ? item.brandResult.brandName : '任意品牌']}
            />
            <div>
              <ShopNumber show value={item.number} />
            </div>
          </div>;
        })
      }
    </div>

    <BottomButton
      only
      text='确认'
      onClick={() => {
        const cartsParams = outSkus.map(item => {
          return {
            'storehouseId': item.storehouseId,
            'skuId': item.skuId,
            'pickListsId': item.pickListsId,
            'number': item.number,
            brandId: item.brandId,
          };
        });
        outStockRun({
          data: {
            code,
            cartsParams,
          },
        });
      }}
    />

  </>;
};

export default OutStockConfirm;
