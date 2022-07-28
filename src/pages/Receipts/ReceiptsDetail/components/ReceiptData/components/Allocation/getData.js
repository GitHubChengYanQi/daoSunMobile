import { ToolUtil } from '../../../../../../components/ToolUtil';

export const getStartData = (startData = []) => {
  const skus = [];
  startData.forEach(item => {
    const skuIds = skus.map(item => item.skuId);
    const skuIndex = skuIds.indexOf(item.skuId);
    if (skuIndex === -1) {
      skus.push({
        haveBrand: item.haveBrand,
        skuId: item.skuId,
        number: item.number,
        storehouseId: item.storehouseId,
        skuResult: item.skuResult,
        brands: [{
          brandId: item.brandId,
          brandName: ToolUtil.isObject(item.brandResult).brandName,
          number: item.number,
          positions: item.storehousePositionsId ? [{
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
          }] : [],
        }],
      });
    } else {
      const sku = skus[skuIndex];
      const brandIds = sku.brands.map(item => item.brandId);
      const brandIndex = brandIds.indexOf(item.brandId);
      const brands = sku.brands;
      if (brandIndex === -1) {
        brands.push({
          skuId: item.skuId,
          number: item.number,
          positions: item.storehousePositionsId ? [{
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
          }] : [],
        });
      } else {
        const brand = brands[brandIndex];
        brands[brandIndex] = {
          ...brand,
          number: item.number + brand.number,
          positions: [...brand.positions, {
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
          }],
        };
      }
      skus[skuIndex] = {
        ...sku,
        number: item.number + sku.number,
        brands,
      };
    }
  });
  return skus;
};

export const getEndData = (skus = [], endData = []) => {
  endData.forEach(item => {
    const skuIds = skus.map(item => item.skuId);
    const skuIndex = skuIds.indexOf(item.skuId);
    if (skuIndex !== -1) {
      const sku = skus[skuIndex];
      const snameStore = item.storehouseId === sku.storehouseId;
      const storeHouse = sku.storeHouse || [];
      const storeIds = storeHouse.map(item => item.id);
      const storeIndex = storeIds.indexOf(item.storehouseId);
      if (storeIndex !== -1) {
        const store = storeHouse[storeIndex];
        const brands = store.brands || [];
        const positions = store.positions || [];
        if (snameStore) {
          const positionIds = positions.map(item => item.id);
          const positionIndex = positionIds.indexOf(item.storehousePositionsId);
          if (positionIndex === -1) {
            positions.push({
              id: item.storehousePositionsId,
              name: ToolUtil.isObject(item.positionsResult).name,
              number: item.number,
              brands: [{
                brandId: item.brandId,
                brandName: ToolUtil.isObject(item.brandResult).brandName,
                number: item.number,
                checked: true,
              }],
            });
          } else {
            const position = positions[positionIndex];
            positions[positionIndex] = {
              ...position,
              number: item.number + position.number,
              brands: [...position.brands, {
                brandId: item.brandId,
                brandName: ToolUtil.isObject(item.brandResult).brandName,
                number: item.number,
              }],
            };
          }
        } else {
          brands.push({
            brandId: item.brandId,
            brandName: ToolUtil.isObject(item.brandResult).brandName,
            number: item.number,
            checked: true,
          });
        }
        storeHouse[storeIndex] = {
          ...store,
          number: item.number + store.number,
          positions,
          brands,
        };
      } else {
        storeHouse.push({
          id: item.storehouseId,
          name: ToolUtil.isObject(item.storehouseResult).name,
          number: item.number,
          show: true,
          brands: !snameStore ? [{
            brandId: item.brandId,
            brandName: ToolUtil.isObject(item.brandResult).brandName,
            number: item.number,
            checked: true,
          }] : [],
          positions: snameStore ? [{
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
            brands: [{
              brandId: item.brandId,
              brandName: ToolUtil.isObject(item.brandResult).brandName,
              number: item.number,
              checked: true,
            }],
          }] : [],
        });
      }
      skus[skuIndex] = {
        ...sku,
        storeHouse,
      };
    }
  });
  return skus;
};
