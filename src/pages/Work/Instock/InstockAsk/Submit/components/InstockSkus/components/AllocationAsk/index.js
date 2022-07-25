import React, { useEffect, useState } from 'react';
import MyNavBar from '../../../../../../../../components/MyNavBar';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import MyCard from '../../../../../../../../components/MyCard';
import Title from '../../../../../../../../components/Title';
import style from '../../../PurchaseOrderInstock/index.less';
import MyRadio from '../../../../../../../../components/MyRadio';
import { RightOutline } from 'antd-mobile-icons';
import { storeHouseSelect } from '../../../../../../../Quality/Url';
import { Picker } from 'antd-mobile';
import Skus from '../Skus';
import Icon from '../../../../../../../../components/Icon';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import OtherData from '../OtherData';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { ReceiptsEnums } from '../../../../../../../../Receipts';
import { PositionShow } from '../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Allocation/components/PositionShow';

export const addApi = { url: '/allocation/add', method: 'POST' };

const AllocationAsk = ({ skus, createType }) => {

  const [params, setParams] = useState({});

  const history = useHistory();

  const query = history.location.query;

  const [selectStore, setSelectStore] = useState();

  const { loading: storeHouseLoaing, data: storeHouses } = useRequest(storeHouseSelect, {
    onSuccess: (res) => {
      if (query.storeHouseId) {
        const storeHouse = ToolUtil.isArray(res).filter(item => item.value === query.storeHouseId)[0];
        setParams({ ...params, storeHouse });
      }
    },
  });

  const { loading: allocationLoading, run: addAllocation } = useRequest(addApi, {
    manual: true,
    onSuccess: (res) => {
      Message.successDialog({
        content: '创建养护申请成功!',
        confirmText: '查看详情',
        cancelText: '返回列表',
        onCancel: () => history.goBack(),
        onConfirm: () => {
          history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.allocation}&formId=${res.allocationId}`);
        },
      });
    },
  });

  const [data, setData] = useState([]);

  let countNumber = 0;

  const skuList = data.map((item, index) => {
    if (item.number > 0) {
      countNumber += (item.number || 0);
    }
    return { ...item, key: index };
  });

  const dataChange = (array = []) => {
    if (array.length === 0 && query.storeHouseId) {
      if (history.length <= 2) {
        history.push('/');
      } else {
        history.goBack();
      }
    }
    setData(array);
  };


  useEffect(() => {
    setParams({ askType: query.askType || 'allocation', allocationType: query.allocationType || 'out' });
    dataChange(skus);
  }, []);

  const createTypeData = (item = {}) => {
    const position = ToolUtil.isArray(item.positionNums)[0] || {};
    const outPositionName = ToolUtil.isObject(position.positionsResult).name;
    const inPositionName = ToolUtil.isObject(position.toPositionsResult).name;
    return {
      title: '调拨申请',
      type: '调拨',
      otherData: [
        item.brandName || '任意品牌',
        <PositionShow outPositionName={outPositionName} inPositionName={inPositionName} />,
      ],
      careful: '注意事项',
      disabled: query.storeHouseId ? ToolUtil.isArray(params.noticeIds).length === 0 : !params.storeHouse,
      buttonHidden: item.number === 0,
    };
  };

  if (storeHouseLoaing) {
    return <MyLoading skeleton />;
  }

  if (ToolUtil.isArray(storeHouses).length === 0){
    return <MyEmpty description='暂无仓库' />
  }

  return <>
    <div style={{ marginBottom: 60 }}>
      <MyNavBar title='调拨申请' />
      {query.storeHouseId && <Skus
        skus={skus}
        createTypeData={createTypeData}
        skuList={skuList}
        countNumber={countNumber}
        dataChange={dataChange}
      />}
      <MyCard
        titleBom={<Title className={style.title}>申请类型 <span>*</span></Title>}
        extra={query.allocationType ?
          (params.askType === 'allocation' ? '调拨' : '移库')
          :
          <div className={style.radios}>
            <MyRadio
              checked={params.askType === 'allocation'}
              onChange={() => {
                setParams({ ...params, askType: 'allocation', allocationType: 'out' });
              }}
            >
              调拨
            </MyRadio>
            <MyRadio
              checked={params.askType === 'moveLibrary'}
              onChange={() => {
                setParams({ ...params, askType: 'moveLibrary' });
              }}
            >
              移库
            </MyRadio>
          </div>}
      />
      <MyCard
        hidden={params.askType === 'moveLibrary'}
        titleBom={<Title className={style.title}>调拨类型 <span>*</span></Title>}
        extra={query.allocationType ?
          (params.allocationType === 'out' ? '调出' : '调入')
          :
          <div className={style.radios}>
            <MyRadio
              checked={params.allocationType === 'out'}
              onChange={() => {
                setParams({ ...params, allocationType: 'out' });
              }}
            >
              调出
            </MyRadio>
            <MyRadio
              checked={params.allocationType === 'in'}
              onChange={() => {
                setParams({ ...params, allocationType: 'in' });
              }}
            >
              调入
            </MyRadio>
          </div>}
      />

      <MyCard
        titleBom={<Title className={style.title}>仓库 <span>*</span></Title>}
        extra={query.storeHouseId ? ToolUtil.isObject(params.storeHouse).label : <div onClick={() => {
          setSelectStore(true);
        }}>
          {params.storeHouse ? params.storeHouse.label : '请选择'}<RightOutline />
        </div>}
      />

      {query.storeHouseId && <OtherData
        createType={createType}
        careful={<Title className={style.title}>调拨原由 <span>*</span></Title>}
        params={params}
        setParams={setParams}
      />}

      <div hidden={query.storeHouseId} className={style.center}>说明：选择移库后，移库的物料将与所在库位解除绑定关系</div>

      <Picker
        popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
        columns={[storeHouses]}
        visible={selectStore}
        onClose={() => setSelectStore(false)}
        onConfirm={(value, options) => {
          const storeHouse = options.items[0] || {};
          setParams({ ...params, storeHouse });
        }}
      />

      <BottomButton
        leftOnClick={() => {
          history.goBack();
        }}
        rightText='提交'
        rightDisabled={createTypeData().disabled}
        rightOnClick={() => {
          if (query.storeHouseId) {
            const detailParams = [];
            skuList.forEach(item => {
              const position = ToolUtil.isArray(item.positionNums)[0] || {};
              const storehousePositions = ToolUtil.isObject(position.positionsResult);
              const toStorehousePositions = ToolUtil.isObject(position.toPositionsResult);
              detailParams.push({
                skuId: item.skuId,
                number: item.number,
                storehousePositionsId: storehousePositions.storehousePositionsId,
                storehouseId: storehousePositions.storehouseId,
                brandId: item.brandId,
                toStorehousePositionsId: toStorehousePositions.storehousePositionsId,
                toStorehouseId: toStorehousePositions.storehouseId,
              });
            });
            addAllocation({
              data: {
                detailParams,
                reason: ToolUtil.isArray(params.noticeIds).toString(),
                enclosure: ToolUtil.isArray(params.mediaIds).toString(),
                userIds: ToolUtil.isArray(params.userIds).toString(),
                remark: params.remark,
                type: params.askType === 'allocation' ? 'allocation' : 'transfer',
                allocationType: params.allocationType === 'in' ? 1 : 2,
                storehouseId:ToolUtil.isObject(params.storeHouse).value
              },
            });
            return;
          }
          history.push({
            pathname: '/Work/Allocation/AllocationAsk',
            query: {
              askType: params.askType,
              allocationType: params.allocationType,
              storeHouseId: params.storeHouse.value,
            },
          });
        }}
      />

      {
        (allocationLoading || storeHouseLoaing) && <MyLoading />
      }

    </div>
  </>;
};

export default AllocationAsk;
