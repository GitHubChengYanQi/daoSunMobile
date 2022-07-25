import React from 'react';
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
import { PositionShow } from './components/PositionShow';

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

  const skuList = data.detailResults || [];

  const [allSku, { toggle }] = useBoolean();

  const assign = getAction('assign').id && permissions;
  const carryAllocation = getAction('carryAllocation').id && permissions;

  return <>
    <MyCard title='申请明细' extra={<div className={style.extra}>
      合计：
      <div>{skuList.length}</div>类
      <div hidden={!countNumber}><span>{countNumber}</span>件</div>
    </div>}>
      {
        skuList.map((item, index) => {

          const outPosition = ToolUtil.isObject(item.positionsResult).name;
          const inPosition = ToolUtil.isObject(item.toPositionsResult).name;

          if (!allSku && index >= 3) {
            return null;
          }

          return <div
            key={index}
            style={{ padding: '8px 0' }}
            className={ToolUtil.classNames(
              style.skuItem,
            )}
          >
            <div className={style.item}>
              <SkuItem
                skuResult={item.skuResult}
                otherData={[
                  item.brandName || '任意品牌',
                  <PositionShow outPositionName={outPosition} inPositionName={inPosition} />,
                ]} />
            </div>
            <div className={style.action}>
              <div>
                <ShopNumber
                  show
                  value={item.number}
                />
              </div>
            </div>
          </div>;
        })
      }
      {skuList.length > 3 && <Divider className={style.allSku}>
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

    {assign && <BottomButton
      only
      text='分配调拨物料'
      onClick={() => {
        history.push(`/Work/Allocation/SelectStoreHouse?id=${data.allocationId}`);
      }} />}
  </>;
};

export default Allocation;
