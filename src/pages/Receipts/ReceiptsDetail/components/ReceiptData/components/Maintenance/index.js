import React, { useEffect, useState } from 'react';
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
import { SkuResultSkuJsons } from '../../../../../../Scan/Sku/components/SkuResult_skuJsons';
import { useModel } from 'umi';
import { nowInDateBetwen } from '../Stocktaking';

const Maintenance = (
  {
    permissions,
    receipts,
    getAction = () => {
      return {};
    },
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const actionPermissions = getAction('maintenanceing').id &&  (permissions || userInfo.id === receipts.userId);

  const outTime = !nowInDateBetwen(receipts.startTime, receipts.endTime);

  const [data, setData] = useState([]);

  const [allSku, { toggle }] = useBoolean();

  const history = useHistory();

  useEffect(() => {
    const selectParamResults = receipts.selectParamResults || [];
    setData(selectParamResults);
  }, [receipts.detailResultsByPositions]);

  return <>
    <MyCard
      title='养护内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      <div className={skuStyle.skus}>
        {
          data.map((item, index) => {

            const skuResult = item.skuResult || [];

            const brands = item.brandResults || [];
            const materials = item.materialResults || [];
            const parts = item.partsResults || [];
            const spuClass = item.spuClassificationResults || [];
            const posotions = item.storehousePositionsResults || [];
            const spus = item.spuResults || [];

            const condition = [];

            brands.map(item => condition.push(item.brandName));
            materials.map(item => condition.push(item.name));
            parts.map(item => condition.push(SkuResultSkuJsons({ skuResult: item, sku: true })));
            spuClass.map(item => condition.push(item.name));
            posotions.map(item => condition.push(item.name));
            spus.map(item => condition.push(item.name));

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
                      skuResult={skuResult}
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
      history.push({
        pathname: '/Work/Maintenance/StartMaintenance',
        query: {
          id: receipts.maintenanceId,
          skuCount: receipts.skuCount,
          positionCount: receipts.positionCount,
          show: true,
        },
      });
    }}>
      <TaskItem
        percent={parseInt((receipts.doneNumberCount / (receipts.numberCount / 1)) * 100)}
        skuSize={receipts.skuCount}
        positionSize={receipts.positionCount}
        noBorder
      />
    </MyCard>

    <MyCard title='负责人' extra={<UserName user={receipts.userResult} />} />

    <MyCard title='任务时间' extra={<div>
      {MyDate.Show(receipts.createTime)} - {MyDate.Show(receipts.endTime)}
    </div>} />

    <MyCard title='养护类型' extra={receipts.type === 'check' ? '复检复调' : '无'} />

    <MyCard title='养护原因'>
      {ToolUtil.isArray(receipts.announcementsResults).length === 0 && <div>无</div>}
      {ToolUtil.isArray(receipts.announcementsResults).map((item, index) => {
        return <div key={index} className={style.carefulShow}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      {receipts.note || '无'}
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {ToolUtil.isArray(receipts.enclosureUrl).length === 0 && '无'}
        <UploadFile show value={ToolUtil.isArray(receipts.enclosureUrl).map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>

    {actionPermissions && <BottomButton
      only
      disabled={outTime}
      text={outTime ? '任务未开始' : '开始养护'}
      onClick={() => {
      history.push({
        pathname: '/Work/Maintenance/StartMaintenance',
        query: {
          id: receipts.maintenanceId,
          skuCount: receipts.skuCount,
          positionCount: receipts.positionCount,
        },
      });
    }} />}

  </>;
};

export default Maintenance;
