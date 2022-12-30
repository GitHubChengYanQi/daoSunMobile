import { ToolUtil } from '../../../../../../../util/ToolUtil';

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
            checked: true,
          }] : [],
        }],
      });
    } else {
      const sku = skus[skuIndex];
      const brandIds = sku.brands.map(item => item.brandId);
      const brandIndex = haveBrand ? brandIds.indexOf(item.brandId) : 0;
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
  const skus = array.filter(() => true);
  endData.forEach(item => {
    const skuIds = skus.map(item => item.skuId);
    const skuIndex = skuIds.indexOf(item.skuId);
    if (skuIndex !== -1) {
      const sku = skus[skuIndex];
      const haveBrand = sku.haveBrand;
      const skuBrands = sku.brands || [];
      const newBrands = skuBrands.map(brandItem => {
        const current = brandItem.brandId === item.brandId;
        return {
          brandId: brandItem.brandId,
          brandName: haveBrand ? (brandItem.brandName || '无品牌') : '任意品牌',
          number: (current || !haveBrand) ? item.number : 0,
          checked: (current || !haveBrand),
          maxNumber: item.number,
          doneNumber: (current || !haveBrand) ? item.doneNumber : 0,
          instockOrderId: item.instockOrderId,
        };
      });
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
              brands: newBrands,
            });
          } else {
            const position = positions[positionIndex];
            const brands = position.brands || [];
            positions[positionIndex] = {
              ...position,
              number: item.number + position.number,
              brands: brands.map(brandItem => {
                const current = brandItem.brandId === item.brandId;
                return {
                  brandId: brandItem.brandId,
                  brandName: haveBrand ? (brandItem.brandName || '无品牌') : '任意品牌',
                  number: (current || !haveBrand) ? item.number + brandItem.number : brandItem.number,
                  checked: current || !haveBrand || brandItem.checked,
                  maxNumber: item.number,
                  doneNumber: (current || !haveBrand) ? item.doneNumber + brandItem.doneNumber : brandItem.doneNumber,
                  instockOrderId: item.brandItem ? brandItem.instockOrderId : null,
                };
              }),
            };
          }
        }

        storeHouse[storeIndex] = {
          ...store,
          number: item.number + store.number,
          positions,
          brands: brands.map(brandItem => {
            const current = brandItem.brandId === item.brandId;
            return {
              brandId: brandItem.brandId,
              brandName: haveBrand ? (brandItem.brandName || '无品牌') : '任意品牌',
              number: (current || !haveBrand) ? item.number : brandItem.number,
              checked: current || !haveBrand || brandItem.checked,
              maxNumber: item.number,
              doneNumber: (current || !haveBrand) ? item.doneNumber : brandItem.doneNumber,
              instockOrderId: item.brandItem ? brandItem.instockOrderId : null,
            };
          }),
        };
      } else {
        storeHouse.push({
          id: item.storehouseId,
          name: ToolUtil.isObject(item.storehouseResult).name,
          number: item.number,
          show: true,
          brands: !snameStore ? newBrands : [],
          positions: snameStore ? [{
            id: item.storehousePositionsId,
            name: ToolUtil.isObject(item.positionsResult).name,
            number: item.number,
            brands: newBrands,
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


export const noDistribution = (hopeSkus, carry, action) => {
  const newHopeSkus = [];
  hopeSkus.forEach(item => {
    let carryNumber = 0;
    carry.forEach(carryItem => {
      if (carryItem.skuId === item.skuId && (action || carryItem.status !== 0)) {
        carryNumber += carryItem.number;
      }
    });
    const number = item.number - carryNumber;
    if (number > 0) {
      const storeHouse = item.storeHouse || [];
      const newStoreHouse = storeHouse.map(item => {
        const brands = item.brands || [];
        const positions = item.positions || [];
        const newBrands = brands.map(item => ({ ...item, checked: carryNumber === 0 ? item.checked : false }));
        const newPositions = positions.map(item => {
          const brands = item.brands || [];
          const newBrands = brands.map(item => ({ ...item, checked: carryNumber === 0 ? item.checked : false }));
          return { ...item, brands: newBrands };
        });
        return { ...item, brands: newBrands, positions: newPositions };
      });
      newHopeSkus.push({ ...item, number, storeHouse: newStoreHouse });
    }
  });
  return newHopeSkus;
};
