import React, { useEffect, useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import Viewpager from '../Viewpager';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import InstockShop from '../InstockShop';
import { useRequest } from '../../../../../../../../../util/Request';
import { shopCartAdd } from '../../../../../../../../Work/Instock/Url';
import Error from '../Error';
import inStockLogo from '../../../../../../../../../assets/instockLogo.png';


const SkuAction = (
  {
    actionId,
    data = [],
    action,
    instockOrderId,
    refresh = () => {
    },
  },
) => {

  const { run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: () => {
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

  const items = [...noAction, ...actions].map((item, index) => {
    return { ...item, key: index };
  });


  const showItems = items.filter(item => !item.hidden);

  let countNumber = 0;
  showItems.map(item => countNumber += item.number);

  const getItemIndex = (key) => {
    let currentIndex = 0;
    showItems.map((item, index) => {
      if (item.key === key) {
        currentIndex = index;
      }
      return null;
    });
    return currentIndex;
  };

  const [allSku, { toggle }] = useBoolean();

  const skuItem = (item, index) => {
    const skuResult = item.skuResult || {};
    const complete = item.realNumber === 0 && item.status === 99;
    const waitInStock = item.status === 1;
    const errorInStock = item.status === -1;

    return <div
      key={index}
      className={style.sku}
    >
      <div hidden={!(waitInStock || complete || errorInStock) } className={style.mask} />
      <div
        className={ToolUtil.classNames(
          style.skuItem,
          showItems.length <= 3 && style.skuBorderBottom,
        )}
      >
        <div hidden={!complete} className={style.logo}>
          <img src={inStockLogo} alt='' />
        </div>
        <div className={style.item}>
          <SkuItem
            imgSize={60}
            skuResult={skuResult}
            describe={ToolUtil.isObject(item.customerResult).customerName}
            extraWidth='126px'
            otherData={ToolUtil.isObject(item.brandResult).brandName}
          />
        </div>
        <div className={style.skuNumber}>
          <ShopNumber value={item.number} show />
        </div>
      </div>
      <div hidden={!waitInStock} className={style.status}>
        待入库
      </div>
      <div hidden={!errorInStock} className={style.status}>
        异常件
      </div>
    </div>;
  };

  const addInstockShop = (formStatus, item, type) => {
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
  };
  return <div style={{ backgroundColor: '#fff' }}>
    <div className={style.skuHead}>
      <div className={style.headTitle}>
        申请明细
      </div>
      <div className={style.extra}>
        合计：<span>{showItems.length}</span>类<span>{countNumber}</span>件
      </div>
    </div>
    {showItems.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
    {
      items.map((item, index) => {

        if ((!allSku && getItemIndex(item.key) >= 3) || item.hidden) {
          return null;
        }

        if (!action || item.status !== 0) {
          return skuItem(item, index);
        }

        return <div key={index}>
          <Viewpager
            currentIndex={index}
            onLeft={() => {
              addInstockShop(1, item, 'waitInStock');
            }}
            onRight={() => {
              setVisible(item);
            }}
          >
            {skuItem(item, index)}
          </Viewpager>
        </div>;
      })
    }

    {showItems.length > 3 && <Divider className={style.allSku}>
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
        skuItem={visible}
        onClose={() => {
          setVisible(false);
        }}
        onSuccess={(item) => {
          setVisible(false);
          refresh();
        }}
      />
    </Popup>


    {action && <InstockShop actionId={actionId} id={instockOrderId} refresh={refresh} />}

  </div>;
};

export default SkuAction;
