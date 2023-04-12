import React, { useEffect, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import { useHistory, useLocation } from 'react-router-dom';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import style from './index.less';
import SkuItem from '../Sku/SkuItem';
import ShopNumber from '../AddShop/components/ShopNumber';
import BottomButton from '../../components/BottomButton';
import { Message } from '../../components/Message';
import CodeNumber from './CodeNumber';
import { NoticeBar } from 'antd-mobile';
import { ToolUtil } from '../../../util/ToolUtil';

const listByCode = { url: '/productionPickLists/listByCode', method: 'GET' };
const outStock = { url: '/productionPickLists/v1.2/createOutStockOrder', method: 'POST' };

const OutStockConfirm = () => {

  const history = useHistory();

  const { query } = useLocation();

  const [outSkus, setOutSkus] = useState([]);

  const [code, setCode] = useState([]);

  const [error, setError] = useState();

  const { loading, run } = useRequest(listByCode, {
    manual: true,
    noError: true,
    onSuccess: (res) => {
      setOutSkus(res);
    },
    onError: () => {
      setError(true);
    },
  });

  const { loading: outStockLoading, run: outStockRun } = useRequest(outStock, {
    manual: true,
    onSuccess: () => {
      Message.successToast('出库成功！', () => {
          setOutSkus([]);
          history.goBack();
        },
      );
    },
  });

  useEffect(() => {
    if (query.code) {
      setCode(query.code);
      run({ params: { code: query.code } });
    } else {
      setOutSkus([]);
      setCode('');
    }
  }, [query.code]);

  if ((loading && query.code) || outStockLoading) {
    return <MyLoading />;
  }

  if (outSkus.length === 0) {
    return <div style={{ backgroundColor: '#fff', height: '100%' }}>
      <MyNavBar title='出库确认' />
      {error &&
      <NoticeBar
        closeable
        onClose={() => setError(false)}
        className={style.noticeBar}
        content='此领料码未查询到物料或码已被使用'
        color='error'
      />}
      <CodeNumber open title='请输入领料码' onSuccess={(code) => {
        setCode(code);
        run({ params: { code } });
      }} />
      {loading && <MyLoading />}
    </div>;
  }

  return <>
    <MyNavBar title='出库确认' />
    <div className={style.skus}>
      {
        outSkus.map((item, index) => {
          const brandNames = ToolUtil.isArray(item.brandNames);
          return <div key={index} className={style.skuItem}>
            <SkuItem
              className={style.sku}
              extraWidth='74px'
              skuResult={item.skuResult}
              otherData={[brandNames.length === 0 ? '任意品牌' : brandNames.join('、')]}
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
        outStockRun({
          data: { code },
        });
      }}
    />

  </>;
};

export default OutStockConfirm;
