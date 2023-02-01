import React, { useEffect, useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import WaitOutSku from './WaitOutSku';
import outShop from '../../../../../../../../../assets/outShop.png';
import Bouncing from '../../../../../../../../components/Bouncing';
import { useRequest } from '../../../../../../../../../util/Request';
import { listByUser } from '../../../../../../../../Work/Production/components/Url';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';

const OutStockShop = (
  {
    outType,
    id,
    taskId,
    refresh = () => {
    },
    shopRef,
  }) => {

  const [visible, setVisible] = useState();

  const [refreshOrder, setRefreshOrder] = useState();

  const [user, setUser] = useState({});

  const [data, setData] = useState([]);

  const [allSkus, setAllSkus] = useState([]);

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
                const data = {
                  ...item,
                  userId: userItem.userId,
                  key: item.skuId + item.brandId + item.pickListsDetailId,
                };
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

  useEffect(() => {
    if (id) {
      run({ data: { pickListsIds: [id] } });
    }
  }, []);

  return <div>
    <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '84px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }}
      className={style.float}
    >
      <div id='pickShop' className={style.actions}>
        <div className={style.action} onClick={() => {
          listRefresh();
          setVisible(true);
        }}>
          <div className={style.actionButton}>
            <Bouncing
              ref={shopRef}
              size={24}
              height={18}
              img={outShop}
              number={loading ? undefined : allSkus.length}
              addAfter={() => {
                listRefresh();
              }}
            />
          </div>
        </div>
      </div>
    </FloatingBubble>


    <MyAntPopup
      title='待出物料'
      onClose={() => {
        if (refreshOrder) {
          setRefreshOrder(false);
          refresh(refreshOrder);
        }
        setVisible(false);
      }}
      visible={visible}
    >
      <WaitOutSku
        listRefresh={listRefresh}
        taskId={taskId}
        outType={outType}
        id={id}
        refresh={(returnSkus) => setRefreshOrder(returnSkus)}
        user={user}
        data={data}
        allSkus={allSkus}
      />
    </MyAntPopup>
  </div>;
};

export default OutStockShop;
