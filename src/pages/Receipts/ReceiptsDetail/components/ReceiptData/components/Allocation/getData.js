import { ToolUtil } from '../../../../../../components/ToolUtil';

export const getStartData = (startData = []) => {
  const skus = [];
  startData.forEach(item => {
    const skuIds = skus.map(item => item.skuId);
    const skuIndex = skuIds.indexOf(item.skuId);
    const haveBrand = item.haveBrand === 1;
    if (skuIndex === -1) {
      skus.push({
        haveBrand: haveBrand,
        skuId: item.skuId,
        number: item.number,
        storehouseId: item.storehouseId,
        skuResult: item.skuResult,
        brands: [{
          show: true,
          brandId: !haveBrand ? null : item.brandId,
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
          show: true,
          brandId: !haveBrand ? null : item.brandId,
          brandName: ToolUtil.isObject(item.brandResult).brandName,
          number: item.number,
          positions: item.storehousePositionsId ? [{
            checked: true,
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
            checked: true,
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

export const getEndData = (array = [], endData = []) => {
  const skus = array.filter(item => true);
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
                brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                number: item.number,
                checked: true,
                maxNumber: item.number,
              }],
            });
          } else {
            const position = positions[positionIndex];
            const posiBrands = position.brands;
            const brandIds = posiBrands.map(item => item.brandId);
            const brandIndex = brandIds.indexOf(item.brandId);
            if (brandIndex === -1) {
              posiBrands.push({
                brandId: item.brandId,
                brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                number: item.number,
                checked: true,
                maxNumber: item.number,
              });
            } else {
              const brand = posiBrands[brandIndex];
              posiBrands[brandIndex] = {
                ...brand,
                number: item.number + brand.number,
                maxNumber: item.number + brand.number,
              };
            }
            positions[positionIndex] = {
              ...position,
              number: item.number + position.number,
              brands: posiBrands,
            };
          }
        } else {
          const brandIds = brands.map(item => item.brandId);
          const brandIndex = brandIds.indexOf(item.brandId);
          if (brandIndex === -1) {
            brands.push({
              brandId: item.brandId,
              brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
              number: item.number,
              checked: true,
              maxNumber: item.number,
            });
          } else {
            const brand = brands[brandIndex];
            brands[brandIndex] = {
              ...brand,
              number: item.number + brand.number,
              maxNumber: item.number + brand.number,
            };
          }

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
            brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
            number: item.number,
            checked: true,
            maxNumber: item.number,
          }] : [],
          positions: snameStore ? [{
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
            brands: [{
              brandId: item.brandId,
              brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
              number: item.number,
              checked: true,
              maxNumber: item.number,
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

export const getStoreHouse = (distributionSkus = []) => {
  const stores = [];
  distributionSkus.forEach(item => {
    const storeHouse = item.storeHouse || [];
    storeHouse.forEach(storeItem => {
      const storeIds = stores.map(item => item.id);
      const storeIndex = storeIds.indexOf(storeItem.id);
      if (storeIndex === -1) {
        stores.push({
          id: storeItem.id,
          name: storeItem.name,
          skus: [{
            ...item,
            number: item.number,
            storeNumber: storeItem.number,
            storeBrands: storeItem.brands,
            storePositions: storeItem.positions,
          }],
        });
      } else {
        const store = stores[storeIndex];
        stores[storeIndex] = {
          ...store,
          skus: [...store.skus, {
            ...item,
            number: item.number,
            storeNumber: storeItem.number,
            storeBrands: storeItem.brands,
            storePositions: storeItem.positions,
          }],
        };
      }
    });
  });
  return stores;
};
