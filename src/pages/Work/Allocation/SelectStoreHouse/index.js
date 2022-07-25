import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MyCard from '../../../components/MyCard';
import SkuItem from '../../Sku/SkuItem';
import ShopNumber from '../../Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button, Popup } from 'antd-mobile';
import style from './index.less';
import LinkButton from '../../../components/LinkButton';
import { useHistory } from 'react-router-dom';
import User from '../../Instock/InstockAsk/Submit/components/InstockSkus/components/User';
import MyCheck from '../../../components/MyCheck';
import MyEmpty from '../../../components/MyEmpty';
import { PositionShow } from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Allocation/components/PositionShow';
import { ToolUtil } from '../../../components/ToolUtil';
import Distribution from './components/Distribution';
import BottomButton from '../../../components/BottomButton';
import { Message } from '../../../components/Message';

export const detailApi = { url: '/allocation/detail', method: 'POST' };
export const checkCart = { url: '/allocation/checkCart', method: 'POST' };
export const allocationCartDelete = { url: '/allocationCart/delete', method: 'POST' };

const SelectStoreHouse = () => {

  const history = useHistory();

  const query = history.location.query;

  const [user, setUser] = useState({});

  const [params, setParams] = useState({});

  const [data, setData] = useState([]);

  const [storeHouses, setStoreHouses] = useState([]);

  const [visible, setVisible] = useState();

  const [fixedSkus, setFixedSkus] = useState([]);

  const info = (skus = [], out) => {
    let newParams;
    const newData = [];
    const stores = [];
    const fixedSku = [];
    newParams = {
      out,
      title: `选择调${out ? '出' : '入'}仓库`,
      distribution: `分配调${out ? '出' : '入'}物料`,
      batch: !out,
      storeHouseTitle: `调${out ? '出' : '入'}仓库`,
    };
    skus.forEach(item => {
      if (out ? item.positionsResult : item.toPositionsResult) {
        if (!item.allocationCartId) {
          fixedSku.push(item);
        }
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
    setFixedSkus(fixedSku);
    setParams(newParams);
    setData(newData);
    setStoreHouses(stores);
  };

  const { loading: deleteLoading, run: deleteRun } = useRequest(allocationCartDelete, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });


  const { loading: checkCartLoading, run: checkCartRun } = useRequest(checkCart, {
    manual: true,
    onSuccess: () => {
      Message.successToast('分派成功！', () => {
        history.goBack();
      });
    },
  });

  const { loading: detailLoading, run: getDetail, refresh } = useRequest(detailApi, {
    manual: true,
    onSuccess: (res) => {
      const detail = res || {};
      const detailResults = res.detailResults || [];
      const allocationCartResults = res.allocationCartResults || [];

      const skus = allocationCartResults;

      detailResults.forEach(item => {
        let cartNumber = 0;
        allocationCartResults.forEach(cartItem => {
          if (cartItem.allocationDetailId === item.allocationDetailId) {
            cartNumber += cartItem.number;
          }
        });
        if ((item.number - cartNumber) > 0) {
          skus.push({ ...item, number: item.number - cartNumber });
        }
      });

      switch (detail.type) {
        case 'allocation':
          if (detail.allocationType === 1) {
            info(skus, true);
          } else {
            info(skus, false);
          }
          break;
        case 'transfer':
          info(skus, false);
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

  return <div style={{ paddingBottom: 60, backgroundColor: '#fff', height: '100%' }}>
    <MyNavBar title={params.title} />
    <div className={style.content}>
      <User id={user.id} title='负责人' name={user.name} onChange={(id, name) => {
        setUser({ id, name });
      }} />
      <MyCard hidden={data.length === 0} title={params.distribution}>
        {
          data.map((item, index) => {
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
                  show
                  value={item.number}
                />
                <Button color='primary' fill='outline' onClick={() => {
                  setVisible(item);
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
                    <LinkButton
                      color={item.allocationCartId ? 'danger' : 'default'}
                      disabled={!item.allocationCartId}
                      onClick={() => {
                        deleteRun({ data: { allocationCartId: item.allocationCartId } });
                      }}
                    >重新选择</LinkButton>
                    <ShopNumber show value={item.number} />
                  </div>
                </div>;
              })
            }
          </MyCard>;
        })
      }
    </div>

    <Popup visible={visible} onMaskClick={() => setVisible(false)} destroyOnClose>
      <Distribution
        skuItem={visible}
        out={params.out}
        onClose={() => setVisible(false)}
        refresh={() => {
          setVisible(false);
          refresh();
        }}
      />
    </Popup>

    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck checked onChange={() => {

        }}>{true ? '取消全选' : '全选'}</MyCheck> <span>已选中 {data.length} 类</span>
      </div>
      <div className={style.buttons}>
        <Button
          color='primary'
          onClick={() => {

          }}
        >确定仓库</Button>
      </div>
    </div>

    <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightDisabled={data.length !== 0 || !user.id}
      rightOnClick={() => {

        checkCartRun({
          data: {
            allocationId: query.id,
            userId: user.id,
            detailParams: fixedSkus,
          },
        });
      }}
    />

    {(detailLoading || deleteLoading || checkCartLoading) && <MyLoading />}

  </div>;
};

export default SelectStoreHouse;
