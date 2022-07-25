import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../../../components/LinkButton';
import { useHistory } from 'react-router-dom';
import User from '../../Instock/InstockAsk/Submit/components/InstockSkus/components/User';
import MyCheck from '../../../components/MyCheck';
import MyEmpty from '../../../components/MyEmpty';
import { PositionShow } from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Allocation/components/PositionShow';
import { ToolUtil } from '../../../components/ToolUtil';

export const detailApi = { url: '/allocation/detail', method: 'POST' };

const SelectStoreHouse = () => {

  const history = useHistory();

  const query = history.location.query;

  const [user, setUser] = useState({});

  const [params, setParams] = useState({});

  const [data, setData] = useState([]);
  console.log(data);

  const [storeHouses, setStoreHouses] = useState([]);

  const info = (detail, out) => {
    let newParams;
    const detailSkus = detail.detailResults || [];
    const newData = [];
    const stores = [];
    newParams = {
      title: `选择调${out ? '出' : '入'}仓库`,
      distribution: `分配调${out ? '出' : '入'}物料`,
      batch: !out,
      storeHouseTitle: `调${out ? '出' : '入'}仓库`,
    };
    detailSkus.forEach(item => {
      if (out ? item.positionsResult : item.toPositionsResult) {
        const storeHouse = (out ? item.storehouseResult : item.toStorehouseResult) || {};
        const storeIds = stores.map(item => item.id);
        const storeIndex = storeIds.indexOf(storeHouse.storehouseId);
        if (storeIndex === -1) {
          stores.push({
            id: storeHouse.storehouseId,
            name: storeHouse.name,
            skus: [item],
          });
        } else {
          const store = stores[storeIndex];
          stores[storeIndex] = {
            ...store,
            skus: [...store.skus, item],
          };
        }
      } else {
        newData.push(item);
      }
    });
    setParams(newParams);
    setData(newData);
    setStoreHouses(stores);
  };

  const { loading: detailLoading, run: getDetail } = useRequest(detailApi, {
    onSuccess: (res) => {
      const detail = res || {};
      switch (detail.type) {
        case 'allocation':
          if (detail.allocationType === 1) {
            info(detail, true);
          } else {
            info(detail, false);
          }
          break;
        case 'transfer':
          info(res, false);
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    if (query.id) {
      getDetail({ data: { allocationId: query.id } });
    }
  }, []);

  if (!query.id) {
    return <MyEmpty />;
  }

  if (detailLoading) {
    return <MyLoading skeleton />;
  }

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

  return <div style={{ paddingBottom: 60, backgroundColor: '#fff', height: '100%' }}>
    <MyNavBar title={params.title} />
    <div className={style.content}>
      <User id={user.id} title='负责人' name={user.name} onChange={(id, name) => {
        setUser({ id, name });
      }} />
      <MyCard title={params.distribution}>
        {
          data.map((item, index) => {
            console.log(item);
            const outName = ToolUtil.isObject(item.positionsResult).name;
            const inName = ToolUtil.isObject(item.toPositionsResult).name;
            return <div key={index} className={style.SkuItem} style={{ border: index === data.length - 1 && 'none' }}>
              <div className={style.sku}>
                <SkuItem
                  skuResult={item.skuResult}
                  otherData={[
                    item.brandName || '任意品牌',
                    <PositionShow outPositionName={outName} inPositionName={inName} />,
                  ]}
                  extraWidth='140px'
                />
              </div>
              <div className={style.action}>
                <ShopNumber
                  value={item.number}
                  onChange={number => {
                    dataChange(item.cartId, { number });
                  }}
                />
                <Button color='primary' fill='outline' onClick={() => {
                  // getStoreHouse({ data: { skuId: item.skuId } });
                }}>选择仓库</Button>
              </div>
            </div>;
          })
        }
      </MyCard>

      {
        storeHouses.map((item, index) => {
          const skus = item.skus || [];
          return <MyCard key={index} title={params.storeHouseTitle} extra={item.name}>
            {
              skus.map((item, index) => {
                const outName = ToolUtil.isObject(item.positionsResult).name;
                const inName = ToolUtil.isObject(item.toPositionsResult).name;
                return <div
                  key={index}
                  className={style.SkuItem}
                  style={{ border: index === data.length - 1 && 'none' }}
                >
                  <div className={style.sku}>
                    <SkuItem
                      skuResult={item.skuResult}
                      otherData={[
                        item.brandName || '任意品牌',
                        <PositionShow outPositionName={outName} inPositionName={inName} />,
                      ]}
                      extraWidth='140px'
                    />
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
          </MyCard>;
        })
      }
    </div>

    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck checked onChange={() => {

        }}>{true ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 类</span>
      </div>
      <div className={style.buttons}>
        <Button
          disabled={data.length === 0}
          color='primary'
          onClick={() => {

          }}
        >确定仓库</Button>
      </div>
    </div>

  </div>;
};

export default SelectStoreHouse;
