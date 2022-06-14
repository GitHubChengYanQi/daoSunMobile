import React, { useEffect, useState } from 'react';
import style from './index.less';
import LinkButton from '../../../../../../../../../components/LinkButton';
import MyCheck from '../../../../../../../../../components/MyCheck';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button, Toast } from 'antd-mobile';
import { useRequest } from '../../../../../../../../../../util/Request';
import {
  listByUser, productionPickListsSend,
} from '../../../../../../../../../Work/Production/components/Url';
import { ToolUtil } from '../../../../../../../../../components/ToolUtil';
import MyEmpty from '../../../../../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../components/Message';

const WaitOutSku = (
  {
    id,
  },
) => {

  const [sys, setSys] = useState();

  const [userIds, setUserIds] = useState([]);

  const { loading, data, run, refresh } = useRequest(listByUser,
    {
      manual: true,
    });

  const { loading: pickLoading, run: pickRun } = useRequest(productionPickListsSend, {
    manual: true,
    onSuccess: () => {
     Message.toast('提醒成功!')
    },
    onError: () => {
      Message.toast('提醒失败!')
    },
  });

  const waitOutSkus = data || [];

  const skus = waitOutSkus.filter(item => {
    const pickListsResults = item.pickListsResults || [];
    const pickLists = pickListsResults.filter(item => {
      const cartResults = item.cartResults || [];
      return cartResults.length > 0;
    });
    return pickLists.length === pickListsResults.length;
  });

  const allChecked = sys ? false : waitOutSkus.length === userIds.length;

  useEffect(() => {
    if (id) {
      run({ data: { pickListsIds: [id] } });
    }
  }, []);

  const checkChange = () => {
    if (sys) {

    } else {

    }
  };

  return <>
    <div className={style.header}>待出物料</div>
    <div className={style.sys}>
      <span>待出 200</span>
      <LinkButton onClick={() => {
        setSys(!sys);
      }}>{sys ? '取消管理' : '管理'}</LinkButton>
    </div>
    <div className={style.content}>
      {(skus.length !== waitOutSkus.length) && <MyEmpty />}
      {
        waitOutSkus.map((userItem, userIndex) => {

          const pickListsResults = userItem.pickListsResults || [];

          const userChecked = sys ? false : userIds.includes(userItem.userId);

          const pickLists = pickListsResults.filter(item => {
            const cartResults = item.cartResults || [];
            return cartResults.length > 0;
          });

          return <div hidden={pickLists.length !== pickListsResults.length} key={userIndex}>
            <div className={style.user}>
              <span onClick={() => {
                if (userChecked){
                  setUserIds(userIds.filter(item=>item !== userItem.userId))
                  return;
                }
                setUserIds([...userIds, userItem.userId]);
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

                return <div hidden={cartResults.length === 0} key={pickIndex}>
                  <div className={style.orderData}>
                    {sys && <span><MyCheck /></span>}xxx的出库申请 / {pickItem.coding}
                  </div>

                  {
                    cartResults.map((cartItem, cartIndex) => {
                      return <div key={cartIndex}>
                        <div
                          className={style.skuItem}
                        >
                          {sys && <span><MyCheck /></span>}
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

          } else {
            if (allChecked) {
              setUserIds([]);
            } else {
              setUserIds(waitOutSkus.map(item => item.userId));
            }
          }
        }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {1} 种</span>
      </div>
      <div className={style.buttons}>
        {sys && <Button color='danger' fill='outline'>退回</Button>}
        {!sys && <Button
          disabled={userIds.length === 0}
          color='primary'
          fill='outline'
          onClick={() => {
            pickRun({ data: { userIds:userIds.toString() } });
          }}
        >备料完成</Button>}
      </div>
    </div>

    {loading && <MyLoading />}

  </>;
};

export default WaitOutSku;
