import React, { useEffect, useState } from 'react';
import style from './index.less';
import LinkButton from '../../../../../../../../../components/LinkButton';
import MyCheck from '../../../../../../../../../components/MyCheck';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
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

const backSkus = { url: '/productionPickListsCart/deleteBatch', method: 'POST' };

const WaitOutSku = (
  {
    id,
    refresh = () => {
    },
  },
) => {

  const [sys, setSys] = useState();

  const [userIds, setUserIds] = useState([]);

  const [returnSkus, setReturnSkus] = useState([]);

  const [data, setData] = useState([]);

  const [allSkus, setAllSkus] = useState([]);

  let count = 0;
  allSkus.map(item => count += item.number);

  const { loading, run, refresh: listRefresh } = useRequest(listByUser,
    {
      manual: true,
      onSuccess: (res) => {
        const newData = [];
        const sku = [];
        ToolUtil.isArray(res).map(userItem => {
          const pickListsResults = userItem.pickListsResults || [];
          const newPickListsResults = [];
          pickListsResults.map(item => {
            const cartResults = item.cartResults || [];
            if (cartResults.length > 0) {
              const newCartResults = cartResults.map(item => {
                const data = { ...item, userId: userItem.userId };
                sku.push(data);
                return data;
              });
              newPickListsResults.push({ ...item, cartResults: newCartResults });
            }
            return null;
          });
          if (newPickListsResults.length > 0) {
            newData.push({ ...userItem, pickListsResults: newPickListsResults });
          }
          return null;
        });
        setAllSkus(sku);
        setData(newData);
      },
    });

  const { loading: pickLoading, run: pickRun } = useRequest(productionPickListsSend, {
    manual: true,
    onSuccess: () => {
      Message.toast('提醒成功!');
    },
    onError: () => {
      Message.toast('提醒失败!');
    },
  });

  const { loading: backLoading, run: backRun } = useRequest(backSkus, {
    manual: true,
    onSuccess: () => {
      listRefresh();
      refresh();
      Message.toast('退回成功!');
    },
    onError: () => {
      Message.toast('退回失败!');
    },
  });


  const allChecked = sys ? returnSkus.length === allSkus.length : data.length === userIds.length;

  useEffect(() => {
    if (id) {
      run({ data: { pickListsIds: [id] } });
    }
  }, []);

  return <>
    <div className={style.header}>待出物料</div>
    <div className={style.sys}>
      <span>待出 {count}</span>
      <LinkButton onClick={() => {
        setSys(!sys);
      }}>{sys ? '取消管理' : '管理'}</LinkButton>
    </div>
    <div className={style.content}>
      {data.length === 0 && <MyEmpty />}
      {
        data.map((userItem, userIndex) => {

          const pickListsResults = userItem.pickListsResults || [];

          const checkUserSkus = returnSkus.filter(item => item.userId === userItem.userId);

          const carts = [];
          pickListsResults.map(item => {
            const cartResults = item.cartResults || [];
            return cartResults.map(item => carts.push(item));
          });

          const userChecked = sys ? checkUserSkus.length === carts.length : userIds.includes(userItem.userId);

          const pickLists = pickListsResults.filter(item => {
            const cartResults = item.cartResults || [];
            return cartResults.length > 0;
          });

          return <div hidden={pickLists.length !== pickListsResults.length} key={userIndex}>
            <div className={style.user}>
              <span onClick={() => {
                if (sys) {
                  const newReturnSku = returnSkus.filter(item => item.userId !== userItem.userId);
                  setReturnSkus(userChecked ? newReturnSku : [...newReturnSku, ...carts]);
                } else {
                  setUserIds(userChecked ? userIds.filter(item => item !== userItem.userId) : [...userIds, userItem.userId]);
                }
              }}>
                <MyCheck
                  checked={userChecked}
                />
                领料人：{userItem.userName}
              </span>
              <LinkButton><SystemQRcodeOutline /></LinkButton>
            </div>

            {
              pickListsResults.map((pickItem, pickIndex) => {

                const cartResults = pickItem.cartResults || [];

                const checkPickSkus = checkUserSkus.filter(item => item.pickListsId === pickItem.pickListsId);

                const checked = checkPickSkus.length === cartResults.length;

                return <div hidden={cartResults.length === 0} key={pickIndex}>
                  <div className={style.orderData}>
                    {sys && <span onChange={() => {
                      const newReruenSkus = returnSkus.filter(item => item.pickListsId !== pickItem.pickListsId);
                      setReturnSkus(checked ? newReruenSkus : [...newReruenSkus, cartResults]);
                    }}><MyCheck checked={checked} /></span>}{ToolUtil.isObject(pickItem.createUserResult).name}的出库申请
                    / {pickItem.coding}
                  </div>

                  {
                    cartResults.map((cartItem, cartIndex) => {

                      const checkedSkus = checkPickSkus.map(item => item.pickListsCart);
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
                              skuResult={cartItem.skuResult}
                              imgSize={60}
                              extraWidth='148px'
                              otherData={ToolUtil.isObject(cartItem.brandResult).brandName}
                            />
                          </div>
                          <div>
                            <ShopNumber value={cartItem.number} show />
                          </div>
                        </div>
                      </div>;
                    })
                  }
                </div>;
              })
            }
          </div>;
        })
      }
    </div>

    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck checked={allChecked} onChange={() => {
          if (sys) {
            setReturnSkus(allChecked ? [] : allSkus);
          } else {
            setUserIds(allChecked ? [] : data.map(item => item.userId));
          }
        }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {sys ? returnSkus.length : userIds.length} 种</span>
      </div>
      <div className={style.buttons}>
        {sys && <Button color='danger' fill='outline' disabled={returnSkus.length === 0} onClick={() => {
          const productionPickListsCartParams = returnSkus.map(item => {
            return {
              pickListsId: item.pickListsId,
              skuId: item.skuId,
              brandId: item.brandId,
            };
          });
          backRun({ data: { productionPickListsCartParams } });
        }}>退回</Button>}
        {!sys && <Button
          disabled={userIds.length === 0}
          color='primary'
          fill='outline'
          onClick={() => {
            pickRun({ data: { userIds: userIds.toString() } });
          }}
        >备料完成</Button>}
      </div>
    </div>

    {(loading || pickLoading || backLoading) && <MyLoading />}

  </>;
};

export default WaitOutSku;
