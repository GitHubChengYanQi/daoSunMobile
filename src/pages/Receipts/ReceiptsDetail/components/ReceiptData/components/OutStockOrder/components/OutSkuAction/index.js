import React, { useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Viewpager from '../../../InstockOrder/components/Viewpager';
import Prepare from '../Prepare';
import OutStockShop from '../OutStockShop';
import outStockLogo from '../../../../../../../../../assets/outStockLogo.png';
import Slash from '../../../../../../../../Work/MyPicking/components/Slash';


const OutSkuAction = (
  {
    pickListsId,
    data = [],
    action,
    refresh = () => {
    },
    dimension = 'order',
  },
) => {


  const [visible, setVisible] = useState();

  const actions = [];
  const noAction = [];

  let countNumber = 0;
  data.map(item => {
    let perpareNumber = 0;
    ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

    const complete = parseInt(item.receivedNumber) - item.number === 0;
    const prepare = complete ? false : perpareNumber === item.number;

    if (complete || prepare) {
      noAction.push({ ...item, complete, prepare, perpareNumber });
    } else {
      actions.push({ ...item, complete, prepare, perpareNumber });
    }
    return countNumber += (item.number || 0);
  });

  const outSkus = [...actions, ...noAction];

  const [allSku, { toggle }] = useBoolean();

  const skuItem = (item, index) => {
    const skuResult = item.skuResult || {};

    const complete = item.complete;
    const prepare = item.prepare;

    let stockNumberColor = '';
    let stockNumberText = '';

    switch (item.stockNumber || 0) {
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

    return <div
      key={index}
      className={style.sku}
    >
      <div hidden={!(complete || prepare)} className={style.mask} />
      <div
        className={ToolUtil.classNames(
          style.skuItem,
          data.length <= 3 && style.skuBorderBottom,
        )}
      >
        <div hidden={!complete} className={style.logo}>
          <img src={outStockLogo} alt='' />
        </div>
        <div className={style.item}>
          <SkuItem
            number={skuResult.stockNumber}
            imgSize={60}
            skuResult={skuResult}
            extraWidth='124px'
            otherData={ToolUtil.isObject(item.brandResult).brandName}
          />
        </div>
        <div className={style.outStockNumber} style={{
          paddingRight: prepare && 20,
        }}>
          <Slash leftText={item.receivedNumber || 0} rightText={item.number} rightStyle={{color:stockNumberColor}} />
          <div>已备料：{item.perpareNumber}</div>
        </div>
      </div>
      <div hidden={!prepare} className={style.status}>
        已备料
      </div>
    </div>;

  };


  return <div style={{ backgroundColor: '#fff' }}>
    <div className={style.skuHead}>
      <div className={style.headTitle}>
        申请明细
      </div>
      <div className={style.extra}>
        合计：<span>{outSkus.length}</span>类<span>{countNumber}</span>件
      </div>
    </div>
    {outSkus.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
    {
      outSkus.map((item, index) => {

        const complete = item.complete;
        const prepare = item.prepare;

        if (!allSku && index >= 3) {
          return null;
        }

        if (!action || complete || prepare || !item.stockNumber) {
          return skuItem(item, index);
        }

        return <div key={index}>
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
