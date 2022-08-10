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
import { ExclamationCircleOutline, RightOutline } from 'antd-mobile-icons';
import { storeHouseSelect } from '../../../../../../../Quality/Url';
import { Picker } from 'antd-mobile';
import Skus from '../Skus';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import OtherData from '../OtherData';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { ReceiptsEnums } from '../../../../../../../../Receipts';
import AllocationSteps from './components/AllocationSteps';
import LinkButton from '../../../../../../../../components/LinkButton';
import AllocationAdd from '../../../../../coponents/SkuInstock/components/AddSku/components/AllocationAdd';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import { shopCartApplyList, shopCartDelete, shopCartEdit } from '../../../../../../Url';

export const addApi = { url: '/allocation/add', method: 'POST' };

const AllocationAsk = ({ createType }) => {

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
      history.push({
        pathname: '/Receipts/ReceiptsResult',
        state: {
          type: ReceiptsEnums.allocation,
          formId: res.allocationId,
        },
      });
    },
    onError: () => {
      Message.errorDialog({
        content: '创建调拨任务失败!',
      });
    },
  });

  const { loading: editLoading, run: shopEdit } = useRequest(shopCartEdit, {
    manual: true,
    onSuccess: () => {
      refresh();
      setAllocationView(false);
    },
  });

  const { loading: shopLoading, refresh } = useRequest({
    ...shopCartApplyList,
    data: { type: createType },
  }, {
    manual: !query.storeHouseId,
    onSuccess: (res) => {
      const newData = ToolUtil.isArray(res);
      if (newData.length === 0) {
        if (history.length <= 2) {
          history.push('/');
        } else {
          history.goBack();
        }
      }
      setData(newData.map((item) => {
        return {
          cartId: item.cartId,
          skuId: item.skuId,
          skuResult: item.skuResult,
          number: item.number,
          positions: ToolUtil.isArray(item.storehousePositions).map(item => {
            return {
              id: item.storehousePositionsId,
              name: item.name,
              number: item.number,
            };
          }),
          allocationJson: JSON.parse(item.allocationJson),
        };
      }));
    },
  });

  const { loading: delelLoading, run: shopDelete } = useRequest(shopCartDelete, {
    manual: true,
    onSuccess: (res) => {
      refresh();
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

  const [allocationView, setAllocationView] = useState();

  useEffect(() => {
    setParams({ askType: query.askType || 'allocation', allocationType: query.allocationType || 'out' });
  }, []);

  const createTypeData = (item = {}) => {
    const allocationJson = item.allocationJson || {};
    const brands = ToolUtil.isObject(allocationJson.start).brands || [];
    return {
      title: '调拨申请',
      type: '调拨',
      otherData: [
        brands.length > 0 ? brands.filter(item => item.show).map(item => item.brandName).join(' / ') : '任意品牌',
        <LinkButton onClick={() => setAllocationView({
          cartId: item.cartId,
          ...item.skuResult,
          number: item.number,
          allocationJson: item.allocationJson,
        })}>查看详情</LinkButton>,
      ],
      careful: '注意事项',
      disabled: query.storeHouseId ? ToolUtil.isArray(params.noticeIds).length === 0 : !params.storeHouse,
      buttonHidden: item.number === 0,
    };
  };

  if (storeHouseLoaing) {
    return <MyLoading skeleton />;
  }

  if (ToolUtil.isArray(storeHouses).length === 0) {
    return <MyEmpty description='暂无仓库' />;
  }

  const submit = () => {
    const skuAndNumbers = [];
    const storehouseAndPositions = [];

    data.forEach(item => {
      const allocationJson = item.allocationJson || {};
      const start = allocationJson.start || {};
      const end = allocationJson.end || {};
      // 需求
      const brands = start.brands || [];
      const showBrands = brands.filter(brandItem => {
        if (brandItem.show) {
          const positions = brandItem.positions || [];
          if (positions.length > 0) {
            positions.forEach(positionItem => {
              if (positionItem.checked){
                skuAndNumbers.push({
                  skuId: item.skuId,
                  brandId: brandItem.brandId,
                  storehousePositionsId: positionItem.id,
                  storehouseId: query.storeHouseId,
                  number: positionItem.outStockNumber,
                  haveBrand: brandItem.brandId !== undefined ? 1 : 0,
                });
              }
            });
          } else {
            skuAndNumbers.push({
              skuId: item.skuId,
              brandId: brandItem.brandId,
              storehouseId: query.storeHouseId,
              number: brandItem.number,
              haveBrand: brandItem.brandId !== undefined ? 1 : 0,
            });
          }
        }
        return brandItem.show;
      });
      if (showBrands.length === 0) {
        skuAndNumbers.push({
          skuId: item.skuId,
          storehouseId: query.storeHouseId,
          number: item.number,
          haveBrand: 0,
        });
      }

      // 期望
      const storeHouse = end.storeHouse || [];
      storeHouse.forEach(storeItem => {
        if (storeItem.show) {
          if (storeItem.id === query.storeHouseId) {
            const positions = storeItem.positions || [];
            positions.forEach(positionItem => {
              const brands = positionItem.brands || [];
              brands.forEach(brandItem => {
                if (brandItem.checked) {
                  storehouseAndPositions.push({
                    skuId: item.skuId,
                    brandId: brandItem.brandId,
                    storehousePositionsId: positionItem.id,
                    storehouseId: storeItem.id,
                    number: brandItem.number,
                  });
                }
              });
            });
          } else {
            const brands = storeItem.brands || [];
            brands.forEach(brandItem => {
              if (brandItem.checked) {
                storehouseAndPositions.push({
                  skuId: item.skuId,
                  brandId: brandItem.brandId,
                  // storehousePositionsId: positionItem.id,
                  storehouseId: storeItem.id,
                  number: brandItem.number,
                });
              }
            });
          }

        }
      });
    });
    addAllocation({
      data: {
        jsonParam: {
          skuAndNumbers,
          storehouseAndPositions,
        },
        reason: ToolUtil.isArray(params.noticeIds).toString(),
        enclosure: ToolUtil.isArray(params.mediaIds).toString(),
        userIds: ToolUtil.isArray(params.userIds).toString(),
        remark: params.remark,
        type: params.askType === 'allocation' ? 'allocation' : 'transfer',
        allocationType: params.allocationType === 'in' ? 1 : 2,
        storehouseId: ToolUtil.isObject(params.storeHouse).value,
      },
    });
  };

  return <>
    <div style={{ marginBottom: 60 }}>
      <MyNavBar title='调拨申请' />
      <AllocationSteps current={query.storeHouseId ? 2 : 0} />
      {query.storeHouseId && <Skus
        skus={data}
        show
        onRemove={(cartId) => {
          shopDelete({ data: { ids: [cartId] } });
        }}
        createTypeData={createTypeData}
        skuList={skuList}
        countNumber={countNumber}
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
        careful={<Title className={style.title}>调拨原因 <span>*</span></Title>}
        params={params}
        setParams={setParams}
      />}

      <div hidden={query.storeHouseId} className={style.explain}>
        <div>
          <ExclamationCircleOutline />&nbsp;&nbsp;说明：
        </div>
        选择移库后，移库的物料将与所在库位解除绑定关系
      </div>

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
        rightText={query.storeHouseId ? '提交' : '下一步'}
        rightDisabled={createTypeData().disabled}
        rightOnClick={() => {
          if (query.storeHouseId) {
            submit();
            return;
          }
          history.push({
            pathname: '/Work/Allocation/AllocationAsk',
            query: {
              askType: params.askType,
              allocationType: params.allocationType,
              storeHouseId: params.storeHouse.value,
              storeHouse: params.storeHouse.label,
            },
          });
        }}
      />

      <MyAntPopup
        title={query.storeHouse + (query.askType === 'moveLibrary' ? '移库' : (query.allocationType === 'out' ? '调出' : '调入'))}
        onClose={() => {
          setAllocationView(false);
        }}
        destroyOnClose
        className={style.addSkuPopup}
        visible={allocationView}
      >
        <AllocationAdd
          open
          noSteps
          query={query}
          sku={allocationView}
          onClose={() => {
            setAllocationView(false);
          }}
          shopEdit={(data) => {
            shopEdit({ data });
          }}
        />
      </MyAntPopup>

      {
        (allocationLoading || storeHouseLoaing || editLoading || shopLoading || delelLoading) && <MyLoading />
      }

    </div>
  </>;
};

export default AllocationAsk;
