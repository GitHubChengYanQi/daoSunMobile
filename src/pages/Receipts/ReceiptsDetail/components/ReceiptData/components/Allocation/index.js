import React, { useEffect, useState } from 'react';
import MyCard from '../../../../../../components/MyCard';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import { getEndData, getStartData, getStoreHouse } from './getData';
import { UserName } from '../../../../../../components/User';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import Detail from './components/Detail';

const Allocation = (
  {
    data,
    getAction = () => {

    },
    permissions,
    refresh = () => {
    },
  },
) => {

  const history = useHistory();

  const [total, setTotal] = useState(0);

  const assign = getAction('assign').id && permissions;
  const carryAllocation = getAction('carryAllocation').id && permissions;

  const [skus, setSkus] = useState([]);

  const [hopeList, setHopeList] = useState([]);
  const [askList, setAskList] = useState([]);
  const [inLibraryList, setInLibraryList] = useState([]);

  const out = data.allocationType !== 1;

  useEffect(() => {
    const detail = data || {};
    const askSkus = getStartData(detail.detailResults);

    const carry = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'carry');
    const hope = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'hope');

    const distributionSkuIds = carry.map(item => item.skuId);

    const hopeSkus = getEndData(askSkus, hope);
    const distributionSkus = getEndData(askSkus, carry).filter(item => distributionSkuIds.includes(item.skuId));

    const inLibrary = [];
    const outPositions = [];
    const inPositions = [];
    distributionSkus.forEach(item => {

      const brands = item.brands || [];
      const storeHouse = item.storeHouse || [];

      brands.forEach(brandItem => {
        const positions = brandItem.positions || [];
        positions.forEach(positionItem => {
          const object = {
            skuId: item.skuId,
            skuResult: item.skuResult,
            brandId: brandItem.brandId || 0,
            brandName: item.haveBrand ? brandItem.brandName : '任意品牌',
            number: positionItem.number,
            positionId: positionItem.id,
            positionName: positionItem.name,
            haveBrand: item.haveBrand,
          };
          out ? outPositions.push(object) : inPositions.push(object);
        });
      });

      storeHouse.forEach(storeItem => {
        const positions = storeItem.positions || [];
        positions.forEach(positionItem => {
          const brands = positionItem.brands || [];
          brands.forEach(brandItem => {
            const object = {
              skuId: item.skuId,
              skuResult: item.skuResult,
              brandId: brandItem.brandId || 0,
              brandName: item.haveBrand ? brandItem.brandName : '任意品牌',
              number: brandItem.number,
              storehouseId: storeItem.id,
              positionId: positionItem.id,
              positionName: positionItem.name,
              haveBrand: item.haveBrand,
            };
            out ? inPositions.push(object) : outPositions.push(object);
          });
        });
      });
    });
    outPositions.forEach(outItem => {
      const library = inPositions.filter(inItem =>
        inItem.skuId === outItem.skuId &&
        (!inItem.haveBrand || inItem.brandId === outItem.brandId) &&
        inItem.positionId !== outItem.positionId,
      );
      library.forEach(inItem => {
        inLibrary.push({
          ...inItem,
          number: outItem.number > inItem.number ? inItem.number : outItem.number,
          positionId: outItem.positionId,
          positionName: outItem.positionName,
          toPositionId: inItem.positionId,
          toPositionName: inItem.positionName,
        });
      });
    });

    const stores = getStoreHouse(distributionSkus);

    setAskList(hopeSkus);
    setHopeList(stores);
    setInLibraryList(inLibrary);

    setSkus(carryAllocation ? distributionSkus : hopeSkus);
    let number = 0;
    askSkus.forEach(item => number += item.number);
    setTotal(number);
  }, []);

  return <>

    <Detail
      carts={data.allocationCartResults || []}
      skus={skus}
      carryAllocation={carryAllocation}
      total={total}
      hopeList={hopeList}
      askList={askList}
      inLibraryList={inLibraryList}
      out={out}
      refresh={refresh}
    />

    <MyCard hidden={!data.userId} title='负责人' extra={<UserName />} />
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
