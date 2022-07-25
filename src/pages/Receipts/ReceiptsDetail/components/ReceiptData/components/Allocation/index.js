import React, { useState } from 'react';
import MyCard from '../../../../../../components/MyCard';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import Icon from '../../../../../../components/Icon';
import ShopNumber from '../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { useBoolean } from 'ahooks';
import { Divider } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import Title from '../../../../../../components/Title';
import LinkButton from '../../../../../../components/LinkButton';
import MyAntPopup from '../../../../../../components/MyAntPopup';
import MyEmpty from '../../../../../../components/MyEmpty';
import Viewpager from '../InstockOrder/components/Viewpager';
import AllocationSkuItem from './components/AllocationSkuItem';

const Allocation = (
  {
    data,
    getAction = () => {

    },
    permissions,
  },
) => {

  const history = useHistory();

  let countNumber = 0;

  const [allSku, { toggle }] = useBoolean();

  const assign = getAction('assign').id && permissions;
  const carryAllocation = getAction('carryAllocation').id && permissions;

  const detailList = (carryAllocation ? data.allocationCartResults : data.detailResults) || [];
  const showList = (carryAllocation ? data.detailResults : data.allocationCartResults) || [];

  const [detailShow, setDetailShow] = useState();

  const [visible, setVisible] = useState();

  return <>
    <MyCard
      titleBom={<div className={style.header}>
        <Title>任务明细</Title>
        <LinkButton style={{ marginLeft: 12 }} onClick={() => {
          setDetailShow(true);
        }}>详情</LinkButton>
      </div>}
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      extra={<div className={style.extra}>
        合计：
        <div>{detailList.length}</div>类
        <div hidden={!countNumber}><span>{countNumber}</span>件</div>
      </div>}>
      {
        detailList.map((item, index) => {

          const view = item.allocationCartId && item.storehouseId === item.toStorehouseId;

          if (!allSku && index >= 3) {
            return null;
          }

          if (!view) {
            return <AllocationSkuItem item={item} key={index} />;
          }

          return <div key={index}>
            <Viewpager
              currentIndex={index}
              onLeft={() => {
                setVisible(true);
              }}
              onRight={() => {
                setVisible(true);
              }}
            >
              <AllocationSkuItem item={item} key={index} />
            </Viewpager>
          </div>;
        })
      }
      {detailList.length > 3 && <Divider className={style.allSku}>
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

    <MyCard title='申请类型' extra={data.type === 'allocation' ? '调拨' : '移库'} />
    <MyCard title='调拨类型' extra={data.allocationType === 2 ? '调出' : '调入'} />
    <MyCard title='仓库' extra='无' />
    <MyCard title='注意事项'>
      {[].length === 0 && <div>无</div>}
      {[].map((item, index) => {
        return <div key={index} className={style.carefulShow} style={{ margin: index === 0 && 0 }}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      <div className={style.remake}>{'无'}</div>
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {[].length === 0 && '无'}
        <UploadFile show value={[].map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>

    <MyAntPopup
      title={carryAllocation ? '调拨申请' : '调拨详情'}
      onClose={() => {
        setDetailShow(false);
      }}
      visible={detailShow}
      destroyOnClose
    >
      <div className={style.details}>
        {showList.length === 0 && <MyEmpty />}
        {
          showList.map((item, index) => {
            return <AllocationSkuItem item={item} key={index} />;
          })
        }
      </div>
    </MyAntPopup>

    {assign && <BottomButton
      only
      text='分配调拨物料'
      onClick={() => {
        history.push(`/Work/Allocation/SelectStoreHouse?id=${data.allocationId}`);
      }} />}
  </>;
};

export default Allocation;
