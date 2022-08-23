import React, { useEffect, useState } from 'react';
import style from './index.less';
import LinkButton from '../../../../../../../../../components/LinkButton';
import MyCheck from '../../../../../../../../../components/MyCheck';
import SkuItem from '../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';
import { useRequest } from '../../../../../../../../../../util/Request';
import {
  listByUser, productionPickListsSend,
} from '../../../../../../../../../Work/Production/components/Url';
import { ToolUtil } from '../../../../../../../../../components/ToolUtil';
import MyEmpty from '../../../../../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../components/Message';
import SearchInkind from '../../../../../../../../../components/InkindList/components/SearchInkind';

const backSkus = { url: '/productionPickListsCart/deleteBatch', method: 'POST' };
const getCartList = { url: '/productionPickListsCart/getCartInkindByLists', method: 'POST' };

const WaitOutSku = (
  {
    id,
    refresh = () => {
    },
    outType,
    taskId,
  },
) => {

  const [sys, setSys] = useState();

  const [user, setUser] = useState({});

  const [returnSkus, setReturnSkus] = useState([]);

  const [data, setData] = useState([]);

  const [allSkus, setAllSkus] = useState([]);

  const [errorSku, setErrorSku] = useState();

  const outTypeData = (item = {}) => {
    switch (outType) {
      case 'StocktakingErrorOutStock':
        return {
          noSys: true,
          skuAction: <>
            <LinkButton onClick={() => {
              setErrorSku({
                skuId: item.skuId,
                brandId: item.brandId,
                skuResult: item.skuResult,
                pickListsId: id,
              });
            }}>查看异常件</LinkButton>
          </>,
        };
      default:
        return {};
    }
  };

  const { loading, run, refresh: listRefresh } = useRequest(listByUser,
    {
      manual: true,
      onSuccess: (res) => {
        const newData = [];
        const sku = [];
        ToolUtil.isArray(res).map(userItem => {
          const pickListsResults = userItem.pickListsResults || [];
          pickListsResults.map(item => {
            const cartResults = item.cartResults || [];
            if (cartResults.length > 0) {
              cartResults.forEach(item => {
                const data = { ...item, userId: userItem.userId };
                sku.push(data);
                newData.push(data);
              });
            }
            return null;
          });
          return null;
        });
        setAllSkus(sku);
        setUser(ToolUtil.isArray(res)[0]);
        setData(newData);
      },
    });

  const { loading: pickLoading, run: pickRun } = useRequest(productionPickListsSend, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提醒成功!');
    },
  });

  const { loading: backLoading, run: backRun } = useRequest(backSkus, {
    manual: true,
    onSuccess: () => {
      Message.successToast('移出成功!');
      listRefresh();
      refresh();
    },
  });


  const allChecked = returnSkus.length === allSkus.length;

  useEffect(() => {
    if (id) {
      run({ data: { pickListsIds: [id] } });
    }
  }, []);

  const checkedSkus = returnSkus.map(item => item.pickListsCart);

  return <>
    <div className={style.header}>待出物料</div>
    <div className={style.sys}>
      <span>数量：{allSkus.length} 类</span>
      <LinkButton disabled={outTypeData().noSys} onClick={() => {
        setSys(!sys);
      }}>{sys ? '退出管理' : '管理'}</LinkButton>
    </div>
    <div className={style.content}>
      {data.length === 0 && <MyEmpty />}
      {
        data.map((cartItem, cartIndex) => {

          const checked = checkedSkus.includes(cartItem.pickListsCart);

          return <div key={cartIndex}>
            <div
              className={style.skuItem}
            >
              {sys && <span onClick={() => {
                if (checked) {
                  setReturnSkus(returnSkus.filter(item => item.pickListsCart !== cartItem.pickListsCart));
                } else {
                  setReturnSkus([...returnSkus, cartItem]);
                }
              }}><MyCheck checked={checked} /></span>}
              <div className={style.item}>
                <SkuItem
                  number={cartItem.stockNumber}
                  skuResult={cartItem.skuResult}
                  imgSize={60}
                  extraWidth='148px'
                  otherData={[ToolUtil.isObject(cartItem.brandResult).brandName || '任意品牌']}
                />
              </div>
              <div>
                {outTypeData(cartItem).skuAction}
                <ShopNumber value={cartItem.number} show />
              </div>
            </div>
          </div>;
        })
      }
    </div>

    <SearchInkind
      noActions
      api={getCartList}
      skuInfo={errorSku}
      onClose={() => setErrorSku(false)}
      visible={errorSku}
    />

    <div className={style.bottom}>
      <div className={style.all}>
        {sys ? <>
          <MyCheck fontSize={16} checked={allChecked} onChange={() => {
            setReturnSkus(allChecked ? [] : allSkus);
          }} />
          {allChecked ? '取消全选' : '全选'}
          <span>已选中 {returnSkus.length} 类</span>
        </> : `领料人：${user.userName || ''}`}
      </div>
      <div className={style.buttons}>
        {sys && <Button color='danger' disabled={returnSkus.length === 0} onClick={() => {
          const productionPickListsCartParams = returnSkus.map(item => {
            return {
              pickListsId: item.pickListsId,
              skuId: item.skuId,
              brandId: item.brandId,
            };
          });
          backRun({ data: { productionPickListsCartParams } });
        }}>移出</Button>}
        {!sys && <Button
          color='primary'
          onClick={() => {
            pickRun({ data: { userIds: user.userId, taskId } });
          }}
        >通知领料</Button>}
      </div>
    </div>

    {(loading || pickLoading || backLoading) && <MyLoading />}

  </>;
};

export default WaitOutSku;
