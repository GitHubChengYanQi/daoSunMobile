import React, { useEffect, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import { useLocation } from 'react-router-dom';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import style from './index.less';
import MyKeybord from '../../components/MyKeybord';
import SkuItem from '../Sku/SkuItem';
import ShopNumber from '../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import BottomButton from '../../components/BottomButton';
import { Message } from '../../components/Message';

const listByCode = { url: '/productionPickLists/listByCode', method: 'GET' };
const outStock = { url: '/productionPickLists/createOutStockOrder', method: 'POST' };

const OutStockConfirm = () => {

  const { query } = useLocation();

  const initialCode = [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }];

  const [code, setCode] = useState(initialCode);

  const [outSkus, setOutSkus] = useState([]);

  const [visible, setVisible] = useState();

  const { loading, run } = useRequest(listByCode, {
    manual: true,
    onSuccess: (res) => {
      setOutSkus(res);
    },
    onError: () => {
      setCode(initialCode);
    },
  });

  const { loading: outStockLoading, run: outStockRun } = useRequest(outStock, {
    manual: true,
    onSuccess: () => {
      Message.successToast('出库成功！', () => {
          setOutSkus([]);
          setCode(initialCode);
          setVisible(false);
        },
      );
    },
  });

  const numbers = code.map(item => item.number).join('');

  useEffect(() => {
    if (query.code) {
      run({ params: { code: query.code } });
    }
  }, []);

  if (loading || outStockLoading) {
    return <MyLoading />;
  }

  if (outSkus.length === 0) {
    return <div style={{ backgroundColor: '#fff', height: '100%' }}>
      <MyNavBar title='出库确认' />
      <div className={style.codeInput}>
        <div className={style.title}>请输入领料码</div>
        <div className={style.inputNumber} onClick={() => {
          setVisible(true);
        }}>
          {
            code.map((item, index) => {
              return <div key={index} className={style.box}>
                {item.number}
              </div>;
            })
          }

        </div>
      </div>

      <MyKeybord
        noStepper
        popupClassName={style.popup}
        visible={visible}
        numberClick={(number) => {
          let ok = 0;
          const newCode = code.map((item, index) => {
            if (!item.number && !ok && item.number !== 0) {
              ok = index + 1;
              return { ...item, number };
            }
            return item;
          });
          if (ok === code.length) {
            run({ params: { code: newCode.map(item => item.number).join('') } });
          }
          setCode(newCode);
        }}
        setVisible={setVisible}
        onConfirm={() => {
          run({ params: { code: code.map(item => item.number).join('') } });
        }}
        onBack={() => {
          const newCode = code.map((item, index) => {
            if (index === numbers.length - 1) {
              return { key: item.key };
            }
            return item;
          });
          setCode(newCode);
        }}
      />
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
            code: query.code || code.map(item => item.number).join(''),
            cartsParams,
          },
        });
      }}
    />

  </>;
};

export default OutStockConfirm;
