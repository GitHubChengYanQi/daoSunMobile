import React, { useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import Viewpager from '../Viewpager';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import InstockShop from '../InstockShop';
import { useRequest } from '../../../../../../../../../util/Request';
import { shopCartAdd } from '../../../../../../../../Work/Instock/Url';
import Error from '../Error';
import InSkuItem from './components/InSkuItem';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { ReceiptsEnums } from '../../../../../../../index';
import { useModel } from 'umi';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';


const SkuAction = (
  {
    actionId,
    data = [],
    action,
    instockOrderId,
    refresh = () => {
    },
    order,
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { loading, run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
    onError: () => {
      refresh();
    },
  });

  const [visible, setVisible] = useState();

  const actions = [];
  const noAction = [];

  data.map((item) => {
    if (item.status === 0) {
      noAction.push(item);
    } else {
      actions.push(item);
    }
    return null;
  });

  const items = [...noAction, ...actions].map(item => {
    return {
      ...item,
      number: item.realNumber,
    };
  });

  let countNumber = 0;
  items.map(item => countNumber += item.number);

  const [allSku, { toggle }] = useBoolean();

  const addShopCart = (
    imgUrl,
    imgId,
    transitionEnd = () => {
    }) => {

    const skuImg = document.getElementById(imgId);
    if (!skuImg) {
      return;
    }
    const top = skuImg.getBoundingClientRect().top;
    const left = skuImg.getBoundingClientRect().left;
    ToolUtil.createBall({
      top,
      left,
      imgUrl,
      transitionEnd,
      getNodePosition: () => {
        const waitInstock = document.getElementById('waitInstock');
        const parent = waitInstock.offsetParent;
        const translates = document.defaultView.getComputedStyle(parent, null).transform;
        let translateX = parseFloat(translates.substring(6).split(',')[4]);
        let tanslateY = parseFloat(translates.substring(6).split(',')[5]);
        return {
          top: parent.offsetTop + tanslateY,
          left: parent.offsetLeft + translateX,
        };
      },
    });
  };

  const addInstockShop = (formStatus, item, index, type) => {
    const skuResult = item.skuResult || {};
    const imgUrl = Array.isArray(skuResult.imgUrls) && skuResult.imgUrls[0] || state.homeLogo;
    addShopCart(imgUrl, `skuImg${index}`, () => {
      addShop({
        data: {
          formStatus,
          type,
          instockListId: item.instockListId,
          skuId: item.skuId,
          customerId: item.customerId,
          brandId: item.brandId,
          number: item.number,
          formId: item.instockListId,
        },
      });
    });

  };

  return <div style={{ backgroundColor: '#fff' }}>
    <div className={style.skuHead}>
      <div className={style.headTitle}>
        申请明细
      </div>
      <div className={style.extra}>
        合计：<span>{items.length}</span>类<span>{countNumber}</span>件
      </div>
    </div>
    {items.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
    {
      items.map((item, index) => {

        if (!allSku && index >= 3) {
          return null;
        }

        if (!action || item.status !== 0) {
          return <InSkuItem item={item} data={items} key={index} />;
        }

        return <div key={index}>
          <Viewpager
            currentIndex={index}
            onLeft={() => {
              addInstockShop(1, item, index, 'waitInStock');
            }}
            onRight={() => {
              setVisible(item);
            }}
          >
            <InSkuItem index={index} item={item} data={items} key={index} />
          </Viewpager>
        </div>;
      })
    }

    {items.length > 3 && <Divider className={style.allSku}>
      <div onClick={() => {
        toggle();
      }}>
        {
          allSku ?
            <UpOutline />
            :
            <DownOutline />
        }
      </div>
    </Divider>}

    <Popup
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Error
        type={ReceiptsEnums.instockOrder}
        skuItem={visible}
        onClose={() => {
          setVisible(false);
        }}
        refreshOrder={refresh}
        onSuccess={(item) => {
          setVisible(false);
        }}
      />
    </Popup>


    {action && <InstockShop order={order} actionId={actionId} id={instockOrderId} refresh={refresh} />}

    {loading && <MyLoading />}

  </div>;
};

export default SkuAction;
