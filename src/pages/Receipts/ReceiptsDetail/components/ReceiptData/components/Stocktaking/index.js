import React, { useEffect, useState } from 'react';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { Divider, ErrorBlock, Space } from 'antd-mobile';
import MyCard from '../../../../../../components/MyCard';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { isArray, isObject, ToolUtil } from '../../../../../../components/ToolUtil';
import MyEllipsis from '../../../../../../components/MyEllipsis';
import skuStyle
  from '../../../../../../Work/CreateTask/components/StocktakingAsk/components/SelectSkus/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import { MyDate } from '../../../../../../components/MyDate';
import BottomButton from '../../../../../../components/BottomButton';
import TaskItem from '../../../../../../Work/Stock/Task/components/TaskItem';
import { useHistory } from 'react-router-dom';
import { UserName } from '../../../../../../components/User';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import Icon from '../../../../../../components/Icon';
import { useModel } from 'umi';
import { MyLoading } from '../../../../../../components/MyLoading';
import MyProgress from '../../../../../../components/MyProgress';
import { ERPEnums } from '../../../../../../Work/Stock/ERPEnums';
import ActionButtons from '../../../ActionButtons';
import { StocktakingRevoke } from '../../../Bottom/components/Revoke';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };
export const inventoryComplete = { url: '/inventoryDetail/complete', method: 'POST' };

export const nowInDateBetwen = (d1, d2) => {
  const dateBegin = MyDate.formatDate(d1);
  const dateEnd = MyDate.formatDate(d2);
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

const Stocktaking = (
  {
    actionNode,
    nodeActions,
    loading,
    permissions,
    taskDetail,
    receipts = {},
    getAction = () => {
      return {};
    },
    afertShow = () => {
    },
    refresh = () => {
    },
    taskId,
    logIds = [],
  },
) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const history = useHistory();

  const participantList = receipts.participantList || [];

  const actionPermissions = getAction('check').id
    &&
    (permissions || userInfo.id === receipts.userId || participantList.filter(item => item.userId === userInfo.id).length > 0);

  const [data, setData] = useState([]);

  const showStock = receipts.method !== 'DarkDisk';

  const [allSku, { toggle }] = useBoolean();

  useEffect(() => {
    const taskList = receipts.taskList || [];
    setData(taskList);
  }, [receipts.taskList]);

  const outTime = !nowInDateBetwen(receipts.beginTime, receipts.endTime);

  return <>
    <MyCard
      title='盘点内容'
      className={style.noPadding}
      headerClassName={style.cardHeader}
      bodyClassName={style.noPadding}>
      {(data.length === 1 && data[0].type === 'all') ?
        <div style={{ padding: 8 }}>
          <ErrorBlock
            style={{ '--image-height': '50px' }}
            status='empty'
            title='全局盘点'
            image={<Icon type='icon-pandian1' style={{ fontSize: 50 }} />}
            description
          />
        </div>
        :
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
                        hiddenNumber={!showStock}
                        skuResult={item.skuResult}
                        otherData={[ToolUtil.isObject(item.brandResult).brandName || '所有品牌']}
                      />
                    </div>
                  </div>
                  <Divider style={{ margin: '0 24px' }} />
                  <div className={skuStyle.text} hidden={condition.length === 0}>
                    <MyEllipsis maxWidth='70vw' width='auto'>{condition.join('/')}</MyEllipsis>
                    &nbsp;&nbsp;({item.realNumber})
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
        </div>}
    </MyCard>

    <MyCard title='任务预览' onClick={() => {
      history.push({
        pathname: '/Work/Inventory/StartStockTaking',
        query: {
          id: receipts.inventoryTaskId,
          show: true,
        },
      });
    }}>
      <div className={style.dateShow}>
        <div className={style.show}>
          <Icon type='icon-pandianwuliao' />
          <div className={style.showNumber}>
            <span>涉及  <span className={style.number}>{receipts.skuSize}</span> 类物料</span>
          </div>
        </div>
        <div className={style.show}>
          <Icon type='icon-pandiankuwei1' />
          <div className={style.showNumber}>
            <span>涉及 <span className={style.number}>{receipts.positionSize}</span> 个库位</span>
          </div>
        </div>
      </div>
      <MyProgress percent={parseInt((receipts.handle / receipts.total) * 100)} />
    </MyCard>

    <MyCard title='任务时间' extra={<div>
      {MyDate.Show(receipts.beginTime)} - {MyDate.Show(receipts.endTime)}
    </div>} />

    <MyCard title='负责人' extra={<UserName user={receipts.principal} />} />

    <MyCard title='参与人员'>
      {participantList.length === 0 && '无'}
      <Space align='center' wrap>
        {
          participantList.map((item, index) => {
            return <UserName key={index} user={item} />;
          })
        }
      </Space>
    </MyCard>

    <MyCard title='明盘' extra={receipts.method === 'OpenDisc' ? '是' : '否'} />

    <MyCard title='静态' extra={receipts.mode === 'dynamic' ? '否' : '是'} />

    <MyCard title='盘点原因'>
      {ToolUtil.isArray(receipts.announcements).length === 0 && <div>无</div>}
      {ToolUtil.isArray(receipts.announcements).map(item => item.content).join('、')}
    </MyCard>

    <MyCard title='备注'>
      {receipts.remark || '无'}
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {ToolUtil.isArray(receipts.mediaUrls).length === 0 && '无'}
        <UploadFile show files={ToolUtil.isArray(receipts.mediaUrls).map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>

    {loading && <MyLoading />}

    {actionNode && <ActionButtons
      taskDetail={taskDetail}
      refresh={refresh}
      afertShow={afertShow}
      taskId={taskId}
      logIds={logIds}
      createUser={receipts.createUser}
      permissions={actionPermissions}
      actions={nodeActions.map(item => {
        if (item.action === 'check') {
          return { ...item, name: outTime ? '任务未开始' : '开始盘点', disabled: outTime };
        }
        return item;
      })}
      onClick={(value) => {
        switch (value) {
          case 'check':
            history.push({
              pathname: '/Work/Inventory/StartStockTaking',
              query: {
                id: receipts.inventoryTaskId,
              },
            });
            break;
          case 'revokeAndAsk':
            StocktakingRevoke(taskDetail);
            break;
          default:
            break;
        }
      }}
    />}

  </>;


};

export default Stocktaking;
