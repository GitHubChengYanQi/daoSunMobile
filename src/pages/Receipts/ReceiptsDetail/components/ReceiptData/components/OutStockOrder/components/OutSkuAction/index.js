import React, { useState } from 'react';
import { Divider, Popup } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Viewpager from '../../../InstockOrder/components/Viewpager';
import Prepare from '../Prepare';
import OutStockShop from '../OutStockShop';
import OutSkuItem from './compoennts/OutSkuItem';
import MyCard from '../../../../../../../../components/MyCard';
import { collectableColor, notPreparedColor, receivedColor } from '../../../../../../../../Work/MyPicking/Sku';
import Title from '../../../../../../../../components/Title';


const OutSkuAction = (
  {
    pickListsId,
    data = [],
    action,
    refresh = () => {
    },
    dimension = 'order',
    taskId,
  },
) => {

  const [visible, setVisible] = useState();

  const actions = [];
  const noAction = [];

  let countNumber = 0;
  data.map(item => {
    let perpareNumber = 0;
    ToolUtil.isArray(item.cartResults).map(item => perpareNumber += item.number);

    const complete = item.status === 99;
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

  return <div style={{ backgroundColor: '#fff' }}>
    <MyCard
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      titleBom={<div className={style.skuTitle}>
        <Title>申请明细</Title>
        <div className={style.status}>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: receivedColor }} />
            已领
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: collectableColor }} />
            可领
          </div>
          <div className={style.statusItem}>
            <div className={style.radius} style={{ backgroundColor: notPreparedColor }} />
            未备
          </div>
        </div>
      </div>}
      extra={<div className={style.extra}>
        合计：<span>{outSkus.length}</span>类<span>{countNumber}</span>件
      </div>}>
      {outSkus.length === 0 && <MyEmpty description={`已全部操作完毕`} />}
      {
        outSkus.map((item, index) => {

          const complete = item.complete;
          const prepare = item.prepare;

          if (!allSku && index >= 3) {
            return null;
          }

          if (!action || complete || prepare || !item.stockNumber) {
            return <OutSkuItem data={data} item={item} key={index} />;
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
              <OutSkuItem data={data} item={item} key={index} />
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
    </MyCard>

    <Popup
      onMaskClick={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Prepare
        taskId={taskId}
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
