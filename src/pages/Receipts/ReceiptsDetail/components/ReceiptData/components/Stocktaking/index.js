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
import TaskItem from '../../../../../../Work/Stock/Task/components/TaskItem';
import { useHistory } from 'react-router-dom';
import { UserName } from '../../../../../../components/User';
import UploadFile from '../../../../../../components/Upload/UploadFile';

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
  },
) => {

  const nowInDateBetwen = (d1, d2) => {
    const dateBegin = new Date(d1);
    const dateEnd = new Date(d2);
    const dateNow = new Date();

    const beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数
    const beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数

    const endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
    const endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数
    if (endDayDiff < 0) {//已过期
      // return false;
    }
    return beginDayDiff >= 0;

  };


  const history = useHistory();

  const actionPermissions = getAction('check').id && permissions && nowInDateBetwen(receipts.beginTime,receipts.endTime);

  const [data, setData] = useState([]);

  const showStock = receipts.method !== 'DarkDisk';

  const [allSku, { toggle }] = useBoolean();

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  return <>
    <MyCard
      title='盘点内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      <div className={skuStyle.skus}>
        {
          data.map((item, index) => {
            const condition = ToolUtil.isArray(item.condition);
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
                <div className={skuStyle.text} hidden={condition.length === 0}>
                  <MyEllipsis maxWidth='70vw' width='auto'>{condition.join('/')}</MyEllipsis>
                  &nbsp;&nbsp;&nbsp;&nbsp;({item.realNumber})
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

    <MyCard title='任务预览' onClick={() => {
      history.push(`/Work/Inventory/StartStockTaking?id=${receipts.inventoryTaskId}&showStock=${showStock ? 1 : 0}&show`);
    }}>
      <TaskItem
        percent={parseInt((receipts.handle / receipts.total) * 100)}
        skuSize={receipts.skuSize}
        positionSize={receipts.positionSize}
        noBorder
      />
    </MyCard>

    <MyCard title='任务时间' extra={<div>
      {MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}
    </div>} />

    <MyCard title='负责人' extra={<UserName user={receipts.principal} />} />

    <MyCard title='参与人员'>
      {
        ToolUtil.isArray(receipts.participantList).map((item, index) => {
          return <UserName key={index} user={item} />;
        })
      }
    </MyCard>

    <MyCard title='方式' extra={receipts.method === 'OpenDisc' ? '明盘' : '暗盘'} />

    <MyCard title='方法' extra={receipts.method === 'dynamic' ? '动态' : '静态'} />

    <MyCard title='盘点原由'>
      {ToolUtil.isArray(receipts.announcements).length === 0 && <div>无</div>}
      {ToolUtil.isArray(receipts.announcements).map((item, index) => {
        return <div key={index} className={style.carefulShow}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      {receipts.remark || '无'}
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {ToolUtil.isArray(receipts.mediaUrls).length === 0 && '无'}
        <UploadFile show value={ToolUtil.isArray(receipts.mediaUrls).map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>


    {actionPermissions && <BottomButton only text='开始盘点' onClick={() => {
      history.push(`/Work/Inventory/StartStockTaking?id=${receipts.inventoryTaskId}&showStock=${showStock ? 1 : 0}`);
    }} />}

  </>;


};

export default Stocktaking;
