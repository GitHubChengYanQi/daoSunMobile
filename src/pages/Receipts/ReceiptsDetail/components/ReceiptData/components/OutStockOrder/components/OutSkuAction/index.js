import React, { useEffect, useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Viewpager from '../../../InstockOrder/components/Viewpager';
import MyEllipsis from '../../../../../../../../components/MyEllipsis';
import Prepare from '../Prepare';
import OutStockShop from '../OutStockShop';


const OutSkuAction = (
  {
    actionId,
    pickListsId,
    data = [],
    action,
    refresh = () => {
    },
    dimension = 'order',
  },
) => {

  const [items, setItems] = useState(data.map((item, index) => {
    return { ...item, key: index };
  }));

  const [visible, setVisible] = useState();

  useEffect(() => {
    setItems(data.map((item, index) => {
      return { ...item, key: index };
    }));
  }, [data.length]);

  const showItems = items.filter(item => !item.hidden);

  let countNumber = 0;
  showItems.map(item => countNumber += (item.number || 0));

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

  const remove = (data = {}) => {
    const newItems = items.map((item) => {
      if (item.pickListsDetailId === data.pickListsDetailId) {
        return { ...item, hidden: true };
      }
      return item;
    });
    setItems(newItems);
  };

  const skuItem = (item, index) => {
    const skuResult = item.skuResult || {};

    let stockNumberColor = '';
    let stockNumberText = '';

    switch (item.stockNumber) {
      case 0:
        stockNumberColor = '#EA0000';
        stockNumberText = '零库存';
        break;
      default:
        if (item.isMeet) {
          stockNumberColor = '#2EAF5D';
          stockNumberText = '库存充足';
        } else {
          stockNumberColor = '#257BDE';
          stockNumberText = '部分满足';
        }
        break;
    }

    return <div key={index} className={ToolUtil.classNames(
      style.skuItems,
      showItems.length <= 3 && style.skuBorderBottom,
    )}>
      <div
        className={style.skuItem}
        style={{ padding: 0 }}
      >
        <div className={style.item}>
          <SkuItem
            imgSize={60}
            skuResult={skuResult}
            extraWidth='124px'
            // otherData={ToolUtil.isObject(item.bradnResult).brandName}
          />
        </div>
        <div className={style.number}>
          <span style={{ color: stockNumberColor }}>{stockNumberText}</span>
          <ShopNumber value={item.number} show />
        </div>
      </div>
      <div>
        <div className={style.positions}>
          <MyEllipsis width='100%'>
            库位1
          </MyEllipsis>
        </div>
        <div className={style.positions}>
          <MyEllipsis width='100%'>
            库位2
          </MyEllipsis>
        </div>
      </div>

    </div>;
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

        if (!action) {
          return skuItem(item, index);
        }

        return <div key={index} style={{ margin: 8 }}>
          <Viewpager
            currentIndex={index}
            onLeft={() => {
              setVisible(item);
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
      <Prepare
        id={pickListsId}
        skuItem={visible}
        dimension={dimension}
        onSuccess={() => {
          remove(visible);
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Popup>

    {action && <OutStockShop id={pickListsId} />}


  </div>;
};

export default OutSkuAction;
