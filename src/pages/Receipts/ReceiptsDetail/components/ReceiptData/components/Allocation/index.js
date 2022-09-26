import React, { useEffect, useState } from 'react';
import MyCard from '../../../../../../components/MyCard';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import { getEndData, getStartData, getStoreHouse, noDistribution } from './getData';
import { UserName } from '../../../../../../components/User';
import { isArray, isObject, ToolUtil } from '../../../../../../components/ToolUtil';
import Detail from './components/Detail';
import { MyLoading } from '../../../../../../components/MyLoading';
import { ERPEnums } from '../../../../../../Work/Stock/ERPEnums';
import ActionButtons from '../../../ActionButtons';

const Allocation = (
  {
    taskId,
    nodeActions = [],
    logIds,
    success,
    data = {},
    getAction = () => {
    },
    permissions,
    refresh = () => {
    },
    afertShow = () => {
    },
    loading,
    createUser,
  },
) => {

  const history = useHistory();

  const carryAllocation = getAction('carryAllocation').id && permissions;

  const [hopeList, setHopeList] = useState([]);
  const [askList, setAskList] = useState([]);
  const [inLibraryList, setInLibraryList] = useState([]);
  const [distributionList, setDistributionList] = useState([]);

  const out = data.allocationType !== 1;
  const transfer = data.type !== 'allocation';

  useEffect(() => {
    if (!success) {
      return;
    }
    const detail = data || {};
    const allocationCartResults = detail.allocationCartResults || [];
    const detailResults = detail.detailResults || [];

    const askSkus = getStartData(detailResults);
    const hope = allocationCartResults.filter(item => item.type === 'hope');
    const hopeSkus = getEndData(askSkus, hope);

    const carry = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'carry');

    const distributionSkuIds = carry.map(item => item.skuId);

    const inLibrary = [];
    allocationCartResults.forEach(cartItem => {
      if (!cartItem.storehousePositionsId) {
        return;
      }
      const detail = detailResults.find(detailItem => detailItem.allocationDetailId === cartItem.allocationDetailId);
      const brandResult = detail.brandResult || {};
      inLibrary.push({
        skuId: detail.skuId,
        skuResult: detail.skuResult,
        brandId: detail.brandId || 0,
        brandName: detail.haveBrand ? brandResult.brandName : '任意品牌',
        haveBrand: detail.haveBrand,
        number: cartItem.number - cartItem.doneNumber,
        doneNumber: cartItem.doneNumber,
        complete: (cartItem.number - cartItem.doneNumber) <= 0,
        num: cartItem.number,
        positionId: out ? detail.storehousePositionsId : cartItem.storehousePositionsId,
        positionName: out ? isObject(detail.positionsResult).name : isObject(cartItem.positionsResult).name,
        toPositionId: !out ? detail.storehousePositionsId : cartItem.storehousePositionsId,
        toPositionName: !out ? isObject(detail.positionsResult).name : isObject(cartItem.positionsResult).name,
      });
    });

    const distributionSkus = getEndData(askSkus, carry).filter(item => distributionSkuIds.includes(item.skuId));

    const distributionList = noDistribution(hopeSkus, carry);

    const stores = getStoreHouse(distributionSkus);
    setAskList(hopeSkus);
    setHopeList(stores.filter(item => item.id !== data.storehouseId));
    setInLibraryList(inLibrary);
    setDistributionList(distributionList);
  }, [success]);

  return <>

    <Detail
      taskId={taskId}
      transfer={transfer}
      allocationId={data.allocationId}
      carryAllocation={carryAllocation}
      hopeList={hopeList}
      askList={askList}
      inLibraryList={inLibraryList}
      distributionList={distributionList}
      out={out}
      refresh={refresh}
    />

    <MyCard hidden={!data.userId} title='负责人' extra={<UserName user={data.userResult} />} />
    <MyCard title='申请类型' extra={data.type === 'allocation' ? '调拨' : '移库'} />
    <MyCard title='调拨类型' extra={data.allocationType === 2 ? '调出' : '调入'} />
    <MyCard title='仓库' extra={ToolUtil.isObject(data.storehouseResult).name} />
    <MyCard title='注意事项'>
      {[].length === 0 && <div>无</div>}
      {[].map((item, index) => {
        return <div key={index} className={style.carefulShow} style={{ margin: index === 0 && 0 }}>
          {item.content}
        </div>;
      })}
    </MyCard>

    <MyCard title='备注'>
      <div className={style.remake}>{data.remark || '无'}</div>
    </MyCard>

    <MyCard title='附件'>
      <div className={style.files}>
        {[].length === 0 && '无'}
        <UploadFile show files={[].map(item => {
          return {
            url: item,
            type: 'image',
          };
        })} />
      </div>
    </MyCard>

    {loading && <MyLoading />}


    <ActionButtons
      refresh={refresh}
      afertShow={afertShow}
      taskId={taskId}
      logIds={logIds}
      createUser={createUser}
      permissions={permissions}
      actions={nodeActions}
      onClick={(value) => {
        switch (value) {
          case 'assign':
            history.push(`/Work/Allocation/SelectStoreHouse?id=${data.allocationId}`);
            break;
          case 'revokeAndAsk':
            history.push({
              pathname: '/Work/CreateTask',
              query: {
                createType: ERPEnums.allocation,
                askType: data.type,
                allocationType: data.allocationType === 1 ? 'in' : 'out',
                storeHouseId: data.storehouseId,
                storeHouse: isObject(data.storehouseResult).name,
              },
              state: {
                files: isArray(data.enclosureUrl).map((item, index) => ({
                  mediaId: data.enclosure && data.enclosure.split(',')[index],
                  url: item,
                })),
                mediaIds: data.enclosure && data.enclosure.split(','),
                noticeIds: data.reason && data.reason.split(','),
                remark: data.remark,
              },
            });
            break;
          default:
            break;
        }
      }}
    />
  </>;
};

export default Allocation;
