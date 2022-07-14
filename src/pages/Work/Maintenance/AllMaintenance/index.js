import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import MaintenanceAction
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Maintenance/components/MaintenanceAction';
import MyEmpty from '../../../components/MyEmpty';

export const allMaintenance = { url: '/maintenanceDetail/getNeed', method: 'POST' };

const AllMaintenance = () => {

  const [data, setData] = useState([]);

  const { loading, refresh } = useRequest(allMaintenance, {
    onSuccess: (res) => {

      const array = res || [];

      const newData = [];

      array.forEach(item => {
        const positionIds = newData.map(item => item.storehousePositionsId);
        const positionIndex = positionIds.indexOf(item.storehousePositionsId);
        if (positionIndex !== -1) {
          const newPosition = newData[positionIndex] || {};
          const skuIds = newPosition.object.map(item => item.skuId);
          const skuIndex = skuIds.indexOf(item.skuId);
          if (skuIndex !== -1) {
            const newSku = newPosition.object[skuIndex] || {};
            const brandIds = newSku.brandResults.map(item => item.brandId);
            const brandIndex = brandIds.indexOf(item.brandId);
            if (brandIndex !== -1) {
              const newBrand = newSku.brandResults[brandIndex];
              newData[positionIndex].object[skuIndex].brandResults[brandIndex] = {
                ...newBrand,
                number: newBrand.number + item.number,
              };
            } else {
              newData[positionIndex].object[skuIndex] = {
                ...newSku,
                brandResults: [...newSku.brandResults, {
                  brandName: item.brandResult.brandName || '无品牌',
                  brandId: item.brandId,
                  number: item.number,
                }],
              };
            }
          } else {
            newData[positionIndex] = {
              ...newPosition,
              object: [...newPosition.object, item.skuResult],
            };
          }
        } else {
          const storehousePositionsResult = item.storehousePositionsResult || {};
          newData.push({
            storehousePositionsId: storehousePositionsResult.storehousePositionsId,
            name: storehousePositionsResult.name,
            object: [{
              ...item.skuResult,
              brandResults: [{
                brandName: item.brandResult.brandName || '无品牌',
                brandId: item.brandId,
                number: item.number,
              }],
            }],
          });
        }
      });

      setData(newData);
    },
  });

  if (loading && data) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title='合并养护' />
    <MaintenanceAction data={data} actionPermissions setData={setData} refresh={refresh} />
    {loading && <MyLoading />}
  </>;
};

export default AllMaintenance;
