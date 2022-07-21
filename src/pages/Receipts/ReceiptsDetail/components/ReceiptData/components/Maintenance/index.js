import React, { useEffect, useState } from 'react';
import MaintenanceAction from './components/MaintenanceAction';
import MyCard from '../../../../../../components/MyCard';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { Divider } from 'antd-mobile';
import skuStyle
  from '../../../../../../Work/Instock/InstockAsk/Submit/components/InstockSkus/components/StocktakingAsk/components/SelectSkus/index.less';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import MyEllipsis from '../../../../../../components/MyEllipsis';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import TaskItem from '../../../../../../Work/Stock/Task/components/TaskItem';
import { MyDate } from '../../../../../../components/MyDate';
import { UserName } from '../../../../../../components/User';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useBoolean } from 'ahooks';
import { useHistory } from 'react-router-dom';

const Maintenance = (
  {
    permissions,
    receipts,
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('maintenanceing').id && permissions;

  const [data, setData] = useState([]);

  const [allSku, { toggle }] = useBoolean();

  const history = useHistory();

  useEffect(() => {
    const selectParamResults = receipts.selectParamResults || [];
    setData(selectParamResults);
  }, [receipts.detailResultsByPositions]);

  return <>
    <MyCard
      title='盘点内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      <div className={skuStyle.skus}>
        {
          data.map((item, index) => {

            const skuResults = item.skuResults || [];

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
                      skuResult={skuResults[0]}
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
      // history.push(`/Work/Inventory/StartStockTaking?id=${receipts.inventoryTaskId}&showStock=${showStock ? 1 : 0}&show`);
    }}>
      <TaskItem
        percent={parseInt((receipts.handle / receipts.total) * 100)}
        skuSize={receipts.skuSize}
        positionSize={receipts.positionSize}
        noBorder
      />
    </MyCard>

    <MyCard title='负责人' extra={<UserName user={receipts.principal} />} />

    <MyCard title='任务时间' extra={<div>
      {MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}
    </div>} />

    <MyCard title='养护类型' extra={receipts.type === 'check' ? '复检复调' : '无'} />

    <MyCard title='养护原由'>
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
      // history.push(`/Work/Inventory/StartStockTaking?id=${receipts.inventoryTaskId}&showStock=${showStock ? 1 : 0}`);
    }} />}

  </>;

  return <MaintenanceAction
    data={data}
    setData={setData}
    actionPermissions={actionPermissions}
    maintenanceId={receipts.maintenanceId}
    refresh={refresh}
  />;
};

export default Maintenance;
