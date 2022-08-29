import React, { useEffect, useState } from 'react';
import MyCard from '../../../../../../components/MyCard';
import style from '../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import UploadFile from '../../../../../../components/Upload/UploadFile';
import BottomButton from '../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';
import { getEndData, getStartData, getStoreHouse, noDistribution } from './getData';
import { UserName } from '../../../../../../components/User';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import Detail from './components/Detail';
import { MyLoading } from '../../../../../../components/MyLoading';

const Allocation = (
  {
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
  },
) => {

  const history = useHistory();

  // const [total, setTotal] = useState(0);

  const assign = getAction('assign').id && permissions;
  const carryAllocation = getAction('carryAllocation').id && permissions;

  const [skus, setSkus] = useState([]);

  const [hopeList, setHopeList] = useState([]);
  const [askList, setAskList] = useState([]);
  const [inLibraryList, setInLibraryList] = useState([]);
  const [distributionList, setDistributionList] = useState([]);

  const out = data.allocationType !== 1;
  const transfer = data.type !== 'allocation';

  useEffect(() => {
    const detail = data || {};
    const askSkus = getStartData(detail.detailResults);
    const hope = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'hope');
    const hopeSkus = getEndData(askSkus, hope);

    // if (!carryAllocation) {
    //   let number = 0;
    //   askSkus.forEach(item => number += item.number);
    //   setTotal(number);
    //   setSkus(hopeSkus);
    //   return;
    // }

    const carry = ToolUtil.isArray(detail.allocationCartResults).filter(item => item.type === 'carry');

    const distributionSkuIds = carry.map(item => item.skuId);


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
              doneNumber: brandItem.doneNumber || 0,
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
        const doneNumber = out ? inItem.doneNumber : outItem.doneNumber;
        const allNumber = outItem.number > inItem.number ? inItem.number : outItem.number;
        if (allNumber <= 0) {
          return;
        }
        const number = allNumber - (doneNumber > 0 ? doneNumber : 0);
        inLibrary.push({
          ...inItem,
          number,
          doneNumber,
          complete: number <= 0,
          num: allNumber,
          positionId: outItem.positionId,
          positionName: outItem.positionName,
          toPositionId: inItem.positionId,
          toPositionName: inItem.positionName,
        });
      });
    });

    const distributionList = noDistribution(hopeSkus, carry);

    const stores = getStoreHouse(distributionSkus);
    setAskList(hopeSkus);
    setHopeList(stores);
    setInLibraryList(inLibrary);
    setSkus(distributionSkus);
    setDistributionList(distributionList);
  }, [success]);

  return <>

    <Detail
      transfer={transfer}
      allocationId={data.allocationId}
      skus={skus}
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

    {assign && <BottomButton
      afertShow={afertShow}
      only
      text='分配调拨物料'
      onClick={() => {
        history.push(`/Work/Allocation/SelectStoreHouse?id=${data.allocationId}`);
      }} />}
  </>;
};

export default Allocation;
