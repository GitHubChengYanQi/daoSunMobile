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
import MyNavBar from '../../../components/MyNavBar';
import { Clock } from '../../../components/MyDate';
import { useHistory, useLocation } from 'react-router-dom';

const getCarts = { url: '/productionPickListsCart/getSelfCartsBySku', method: 'POST' };
const outStockBySku = { url: '/productionPickLists/createCode', method: 'POST' };

export const receivedColor = '#5ABAFF';
export const collectableColor = '#257BDE';
export const notPreparedColor = '#D3E7FD';

const Sku = () => {

  const { query } = useLocation();

  const history = useHistory();

  const [code, setCode] = useState('');

  const { loading: skuLoading, run: skuRun } = useRequest(outStockBySku, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setCode(54321);
      Message.successToast('领取成功！', () => {
        cartRefresh();
      });
    },
  });

  const codeImg = jrQrcode.getQrBase64(`${process.env.wxCp}Work/OutStockConfirm?code=${code}`);

  const [data, setData] = useState([]);

  const [details, setDetails] = useState([]);

  const [checkSku, setCheckSku] = useState([]);

  const skuChange = (newCheckSku) => {
    setCheckSku(newCheckSku);
  };

  const { loading, refresh: cartRefresh, run } = useRequest(getCarts, {
    manual: true,
    onSuccess: (res) => {
      let count = 0;
      const newData = [];
      const keys = [];
      ToolUtil.isArray(res).map(item => {
        const skuResults = item.skuResults || [];
        newData.push({
          ...item,
          skuResults: skuResults.map(skuItem => {
            const cartResults = skuItem.cartResults || [];
            return {
              ...skuItem,
              cartResults: cartResults.map(item => {
                const key = skuItem.skuId + item.pickListsId;
                const detailItem = { ...item, key, outNumber: item.number };
                keys.push(detailItem);
                return detailItem;
              }),
              key: skuItem.skuId,
            };
          }),
        });
        return count += skuResults.length;
      });
      setDetails(keys);
      setData(newData);
    },
  });

  useEffect(() => {
    if (!query.storehouseId) {
      return Message.errorDialog({
        content: '请选择仓库！',
        onConfirm: () => {
          history.goBack();
        },
      });
    }
    run({ data: { storehouseId: query.storehouseId } });
  }, []);

  const checkSkuKey = checkSku.map(item => item.key);

  const allChecked = details.length === checkSkuKey.length;

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
        return { ...item, skuResults: newSkuResults };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  return <div className={style.myPicking}>

    <MyNavBar title='领料中心' />
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
        <MyCheck checked={allChecked} onChange={() => {
          if (allChecked) {
            setCheckSku([]);
          } else {
            setCheckSku(details);
          }
        }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {checkSkuKey.length} 类</span>
      </div>
      <div className={style.buttons}>
        <Button
          disabled={checkSku.length === 0}
          color='primary'
          onClick={() => {
            const cartsParams = [];
            checkSku.map(skuItem => {
              return cartsParams.push({
                'storehouseId': skuItem.storehouseId,
                'skuId': skuItem.skuId,
                'pickListsId': skuItem.pickListsId,
                'number': skuItem.outNumber,
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
      content={<div style={{ textAlign: 'center' }}>
        <div>领料码</div>
        {code && <>失效剩余时间：<Clock seconds={600} /></>}
        <img src={codeImg} alt='' />
        <div>{code}</div>
      </div>}
      actions={[[
        { text: '取消', key: 'close' },
        { text: '打印二维码', key: 'print', disabled: ToolUtil.isQiyeWeixin() },
      ]]}
      onAction={(action) => {
        switch (action.key) {
          case 'close':
            setCode('');
            return;
          case 'print':
            PrintCode.print([codeImg], 0);
            return;
          default:
            return;
        }
      }}
    />

    {(loading || skuLoading) && <MyLoading />}

  </div>;
};

export default Sku;
