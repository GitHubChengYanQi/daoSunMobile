import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { isArray, ToolUtil } from '../../../../../../../../../../../util/ToolUtil';
import style from './index.less';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import { Button } from 'antd-mobile';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import OutItem from './components/OutItem';
import MyActionSheet from '../../../../../../../../../../components/MyActionSheet';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { mediaGetMediaUrls } from '../../../../../../../../../../Work/OutStock/OnePrepare';


export const getCarts = { url: '/productionPickListsCart/getSelfCartsByLists', method: 'POST' };
export const outStockBySku = { url: '/productionPickLists/createCode', method: 'POST' };

export const receivedColor = '#257BDE';
export const collectableColor = '#D3E7FD';
export const notPreparedColor = '#E8E8E8';


const MyPicking = (
  {
    pickListsId,
    onSuccess = () => {

    },
  }) => {


  const [visible, setVisible] = useState();

  const [data, setData] = useState([]);

  let total = 0;
  const checkSku = [];
  data.forEach(item => {
    total += item.collectable;
    if (item.checked) {
      checkSku.push(item);
    }
  });

  const { loading: skuLoading, run: skuRun } = useRequest(outStockBySku, {
    manual: true,
    onSuccess: (res) => {
      onSuccess(res, checkSku);
    },
  });


  const [storehouse, setStorehouse] = useState({});

  const [stores, setStores] = useState([]);

  const action = storehouse.storehouseId;

  const { data: skuMediaUrls, run: getMediaUrls } = useRequest(mediaGetMediaUrls, { manual: true });

  const initData = (res, storehouseId) => {
    getMediaUrls({
      data: {
        mediaIds: ToolUtil.isArray(res).map(item => item.skuResult?.images?.split(',')[0]),
        option: 'image/resize,m_fill,h_74,w_74',
      },
    });
    const newData = [];
    const newStorehouse = [];
    let total = 0;
    ToolUtil.isArray(res).forEach(item => {
      const cartResults = item.cartResults || [];
      let collectable = 0;
      cartResults.forEach(cartItem => {
        if (storehouseId) {
          if (storehouseId === cartItem.storehouseId) {
            collectable += cartItem.number;
          }
        } else {
          const storeIds = newStorehouse.map(item => item.storehouseId);
          const storeIndex = storeIds.indexOf(cartItem.storehouseId);
          if (storeIndex === -1) {
            newStorehouse.push({
              ...cartItem.storehouseResult,
              type: [item.pickListsDetailId],
              number: cartItem.number,
            });
          } else {
            const store = newStorehouse[storeIndex];
            const type = store.type || [];
            newStorehouse[storeIndex] = {
              ...store,
              type: type.includes(item.pickListsDetailId) ? type : [...type, item.pickListsDetailId],
              number: store.number + cartItem.number,
            };
          }
          collectable += cartItem.number;
        }
      });
      if (collectable > 0) {
        total += collectable;
        newData.push({
          ...item,
          key: item.pickListsDetailId,
          collectable,
          outNumber: collectable,
          checked: false,
        });
      }
    });
    if (storehouseId) {
      return setData(newData);
    }
    if (newStorehouse.length === 1) {
      setStorehouse(newStorehouse[0]);
    }
    setStores(newStorehouse);
    setData(newData);
    return {
      type: newData.length,
      total,
    };
  };

  const { loading, data: details, run } = useRequest(getCarts, {
    manual: true,
    onSuccess: (res) => {
      initData(res);
    },
  });

  useEffect(() => {
    run({ data: { pickListsId } });
  }, []);

  const allChecked = data.length === checkSku.length;

  const dataChange = (key, params) => {
    const newData = data.map(item => {
      if (item.key === key) {
        return { ...item, ...params };
      } else {
        return item;
      }
    });
    setData(newData);
  };


  return <div className={style.myPicking}>

    <div className={style.content}>
      <div className={style.top}>
        <div className={style.skuNumber}>
          可领物料：
          <span className={style.blue}>{data.length}</span>类
          <span className={style.blue}>{total}</span>件
        </div>
        <div>
          <LinkButton onClick={() => {
            setVisible(true);
          }}>
            <EnvironmentOutline />{storehouse.name || '全部'} >
          </LinkButton>
        </div>
      </div>

      {data.length === 0 && <MyEmpty description='暂无待领取物料' />}
      {
        data.map((item, index) => {
          const media = isArray(skuMediaUrls).find(mediaItem => mediaItem.mediaId === item.skuResult?.images?.split(',')[0]);
          const itemSku = item.skuResult || {};
          const skuResult = {
            spuResult: {
              name: itemSku.spuName,
            },
            skuName: itemSku.skuName,
            specifications: itemSku.specifications,
            imgResults: media ? [{ thumbUrl: media.thumbUrl }] : [],
          };
          return <OutItem
            extraWidth='130px'
            action={action}
            key={index}
            skuItem={{ ...item, skuResult }}
            skuIndex={index}
            dataChange={dataChange}
          />;
        })
      }
    </div>


    <div className={style.bottom} hidden={!action}>
      <div className={style.all}>
        <MyCheck fontSize={24} checked={allChecked} onChange={() => {
          setData(data.map(item => {
            return { ...item, checked: !allChecked };
          }));
        }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {checkSku.length} 类</span>
      </div>
      <Button
        className={style.ok}
        disabled={checkSku.length === 0}
        color='primary'
        onClick={() => {
          const cartsParams = [];
          checkSku.forEach(skuItem => {
            const cartResults = skuItem.cartResults || [];
            const brandIds = [];
            const cartIds = []
            cartResults.forEach(item => {
              if (!brandIds.includes(item.brandId)) {
                brandIds.push(item.brandId || '0');
              }

              if (item.storehouseId === storehouse.storehouseId) {
                cartIds.push(item.pickListsCart)
              }
            });
            cartsParams.push({
              cartIds,
              storehouseId: storehouse.storehouseId,
              skuId: skuItem.skuId,
              pickListsId: skuItem.pickListsId,
              number: skuItem.outNumber,
              brandIds,
            });
          });
          skuRun({
            data: {
              cartsParams,
            },
          });
        }}
      >确认</Button>
    </div>


    <MyActionSheet
      visible={visible}
      onAction={(action) => {
        initData(details, action.key);
        setStorehouse({ name: action.name, storehouseId: action.key });
        setVisible(false);
      }}
      onClose={() => setVisible(false)}
      actions={stores.map(item => {
        const type = item.type || [];
        return {
          text: <>
            {item.name}（可领
            <span className={style.blue}>{type.length} </span>类
            <span className={style.blue}>{item.number}</span> 件）
          </>,
          key: item.storehouseId, name: item.name,
        };
      })}
    />

    {(loading || skuLoading) && <MyLoading />}

  </div>;
};

export default MyPicking;
