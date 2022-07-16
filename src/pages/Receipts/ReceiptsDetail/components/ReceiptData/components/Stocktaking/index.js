import React, { useEffect, useState } from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { Divider } from 'antd-mobile';
import MyCard from '../../../../../../components/MyCard';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import MyEllipsis from '../../../../../../components/MyEllipsis';
import skuStyle
  from '../../../../../../Work/Instock/InstockAsk/Submit/components/InstockSkus/components/StocktakingAsk/components/SelectSkus/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import { MyDate } from '../../../../../../components/MyDate';
import { Avatar } from 'antd';
import BottomButton from '../../../../../../components/BottomButton';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };
export const inventoryComplete = { url: '/inventoryDetail/complete', method: 'POST' };

const Stocktaking = (
  {
    permissions,
    receipts = {},
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('check').id && permissions;

  const [data, setData] = useState([]);

  const showStock = receipts.method !== 'DarkDisk';

  const [allSku, { toggle }] = useBoolean();

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  return <>
    <MyCard
      title='添加盘点内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      <div className={skuStyle.skus}>
        {
          data.map((item, index) => {
            if (!allSku && index >= 3) {
              return null;
            }
            return <div key={index} className={skuStyle.skuItem}>
              <div className={skuStyle.nav} style={{
                background: index % 2 === 0 ? 'rgb(57 116 199 / 20%)' : 'rgb(57 116 199 / 50%)',
                color: index % 2 === 0 ? 'rgb(57 116 199 / 80%)' : '#fff',
              }}>
                物 <br /> 料 <br />{index + 1}
              </div>
              <div className={skuStyle.skuData}>
                <div className={skuStyle.skuAction}>
                  <div className={skuStyle.sku}>
                    <SkuItem
                      skuResult={item.skuResult}
                      otherData={[ToolUtil.isObject(item.brandResult).brandName || '任意品牌']}
                    />
                  </div>
                </div>
                <Divider style={{ margin: '0 24px' }} />
                <div className={skuStyle.text} hidden={!item.params}>
                  <MyEllipsis maxWidth='70vw' width='auto'>{item.filterText}</MyEllipsis>
                  ({item.skuNum})
                </div>
              </div>

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
      </div>
    </MyCard>

    <MyCard title='任务预览'>

    </MyCard>

    <MyCard title='任务时间' extra={<div>
      {MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}
    </div>} />

    <MyCard title='负责人' extra={ToolUtil.isObject(receipts.user).name ? <div className={style.alignCenter}>
      <Avatar size={20}>{ToolUtil.isObject(receipts.user).name.substring(0,1)}</Avatar> {ToolUtil.isObject(receipts.user).name}
    </div> : '无'} />

    <MyCard title='参与人员'>

    </MyCard>

    <MyCard title='方式' extra={receipts.method === 'OpenDisc' ? '明盘' : '暗盘'} />

    <MyCard title='方法' extra={receipts.method === 'dynamic' ? '动态' : '静态'}/>

    <MyCard title='盘点缘由'>
      {[].length === 0 && <div>无</div>}
      {[].map((item, index) => {
        return <div key={index} className={style.carefulShow}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      无
    </MyCard>

    <MyCard title='附件'>

    </MyCard>


    {actionPermissions && <BottomButton only text='开始盘点' />}

  </>;


};

export default Stocktaking;
