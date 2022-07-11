import React, { useEffect, useState } from 'react';
import MyCheck from '../../../components/MyCheck';
import style from './index.less';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { ToolUtil } from '../../../components/ToolUtil';
import { Button, Dialog } from 'antd-mobile';
import { Message } from '../../../components/Message';
import PrintCode from '../../../components/PrintCode';
import jrQrcode from 'jr-qrcode';
import MySearch from '../../../components/MySearch';
import Icon from '../../../components/Icon';
import OutSkuItem from './components/OutSkuItem';

const getCarts = { url: '/productionPickListsCart/getSelfCartsBySku', method: 'POST' };
const outStockBySku = { url: '/productionPickLists/createOutStockOrderBySku', method: 'POST' };

export const receivedColor = '#5ABAFF';
export const collectableColor = '#257BDE';
export const notPreparedColor = '#D3E7FD';

const Sku = () => {

  const { loading: skuLoading, run: skuRun } = useRequest(outStockBySku, {
    manual: true,
    onSuccess: () => {
      Message.successToast('领取成功！', () => {

      });
    },
  });

  const [code, setCode] = useState();

  const codeImg = jrQrcode.getQrBase64(`${process.env.wxCp}Work/OutStockConfirm?code=${code}`);

  const [data, setData] = useState([]);
  console.log(data);

  const [checkSku, setCheckSku] = useState([]);

  const skuChange = (newCheckSku) => {
    setCheckSku(newCheckSku);
  };

  const { loading, refresh: cartRefresh } = useRequest(getCarts, {
    onSuccess: (res) => {
      let count = 0;
      const newData = [];
      ToolUtil.isArray(res).map(item => {
        const skuResults = item.skuResults || [];
        const storehouseResult = item.storehouseResult || {};
        newData.push({
          ...item,
          key: storehouseResult.storehouseId,
          skuResults: skuResults.map(skuItem => {
            const cartResults = skuItem.cartResults || [];
            return {
              ...skuItem,
              cartResults: cartResults.map(item => {
                return { ...item, key: skuItem.skuId + item.pickListsId, outNumber: item.number };
              }),
              key: skuItem.skuId,
              storehouseId: storehouseResult.storehouseId,
            };
          }),
        });
        return count += skuResults.length;
      });
      setData(newData);
    },
  });

  const checkSkuKey = checkSku.map(item => item.key);

  const detailChange = (storeHouseIndex, skuIndex, detailIndex, params) => {
    const newData = data.map((item, index) => {
      if (index === storeHouseIndex) {
        const skuResults = item.skuResults || [];
        const newSkuResults = skuResults.map((item, index) => {
          if (index === skuIndex) {
            const cartResults = item.cartResults || [];
            const newCartResults = cartResults.map((item, index) => {
              if (index === detailIndex) {
                return { ...item, ...params };
              } else {
                return item;
              }
            });
            return { ...item, cartResults: newCartResults };
          } else {
            return item;
          }
        });
        return { ...item, skuResults:newSkuResults };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  return <div className={style.myPicking}>

    <div className={style.content}>

      <MySearch
        searchIcon={<><Icon type='icon-dibudaohang-saoma' /> | </>}
        placeholder='搜索'
        onSearch={(value) => {

        }}
        onClear={() => {

        }}
      />
      <div className={style.top}>
        <div className={style.skuNumber}>可领物料：<span>{1}</span>类</div>
        <div className={style.status}>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: receivedColor }} />
            已领
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: collectableColor }} />
            可领
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: notPreparedColor }} />
            未备
          </div>
        </div>
      </div>

      {
        data.map((item, index) => {

          const skuResults = item.skuResults || [];

          return <div key={index} className={style.outSku}>
            {
              skuResults.map((skuItem, skuIndex) => {
                return <OutSkuItem
                  storeHouseIndex={index}
                  key={skuIndex}
                  skuItem={skuItem}
                  skuIndex={skuIndex}
                  checkSku={checkSku}
                  checkSkuKey={checkSkuKey}
                  skuChange={skuChange}
                  detailChange={detailChange}
                />;
              })
            }

          </div>;
        })
      }
    </div>


    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck onChange={() => {

        }}>{true ? '取消全选' : '全选'}</MyCheck> <span>已选中 {0} 类</span>
      </div>
      <div className={style.buttons}>
        <Button
          color='primary'
          onClick={() => {
            const cartsParams = [];
            [].map(skuItem => {
              const cartResults = skuItem.cartResults || [];
              return cartResults.map(item => {
                return cartsParams.push({
                  'storehouseId': skuItem.storehouseId,
                  'skuId': skuItem.skuId,
                  'pickListsId': item.pickListsId,
                  'number': item.number,
                });
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
    </div>

    <Dialog
      visible={code}
      content={<>
        <div style={{ textAlign: 'center' }}>领料码</div>
        {codeImg}
        <div style={{ textAlign: 'center' }}>{code}</div>
      </>}
      actions={[[
        { text: '取消', key: 'close' },
        { text: '打印二维码', key: 'print', disabled: ToolUtil.isQiyeWeixin() },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            return;
          case 'print':
            PrintCode.print([codeImg], 0);
            return;
          default:
            return;
        }
      }}
    />

    {loading && <MyLoading />}

  </div>;
};

export default Sku;
