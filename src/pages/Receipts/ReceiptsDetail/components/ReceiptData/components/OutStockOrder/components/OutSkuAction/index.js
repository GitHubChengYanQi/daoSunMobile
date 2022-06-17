import React, { useState } from 'react';
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


  const [visible, setVisible] = useState();

  let countNumber = 0;
  data.map(item => countNumber += (item.number || 0));

  const [allSku, { toggle }] = useBoolean();

  const skuItem = (item, index) => {
    const skuResult = item.skuResult || {};
    const stockNumber = item.stockNumber || 0;

    const positions = [];


    ToolUtil.isArray(item.positionAndStockDetail).map((item) => {
      if (!positions.map(item => item.storehousePositionsId).includes(item.storehousePositionsId)) {
        positions.push(item);
      }
      return null;
    });


    let stockNumberColor = '';
    let stockNumberText = '';

    switch (stockNumber) {
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
      data.length <= 3 && style.skuBorderBottom,
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
            otherData={ToolUtil.isObject(item.brandResult).brandName}
          />
        </div>
        <div className={style.number}>
          <span style={{ color: stockNumberColor }}>{stockNumberText}</span>
          <ShopNumber value={item.number} show />
        </div>
      </div>
      <div>
        {
          positions.map((item, index) => {
            return <div className={style.positions} key={index}>
              <MyEllipsis width='100%'>
                {item.storeHousePositionsName}   库存{item.number}
              </MyEllipsis>
            </div>;
          })
        }
      </div>

    </div>;
  };


  return <div style={{ backgroundColor: '#fff' }}>
    <div className={style.skuHead}>
      <div className={style.headTitle}>
        申请明细
      </div>
      <div className={style.extra}>
        合计：<span>{data.length}</span>类<span>{countNumber}</span>件
      </div>
    </div>
    {data.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
    {
      data.map((item, index) => {

        if (!allSku && index >= 3) {
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

    {data.length > 3 && <Divider className={style.allSku}>
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
          refresh();
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Popup>

    {action && <OutStockShop id={pickListsId} refresh={refresh} />}


  </div>;
};

export default OutSkuAction;
