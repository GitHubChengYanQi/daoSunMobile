export const SkuResultSkuJsons = ({ skuResult, describe, spu, sku, emptyText }) => {

  if (!(skuResult && skuResult.spuResult)) {
    return '-';
  }

  if (describe) {
    return `${
      skuResult.skuJsons
      &&
      skuResult.skuJsons.length > 0
      &&
      skuResult.skuJsons[0].values.attributeValues
      &&
      skuResult.skuJsons.map((items) => {
        return `${items.attribute.attribute}:${items.values.attributeValues}`;
      }).join(' , ') || (emptyText || '-')
    }`;
  }

  if (spu) {
    return `${skuResult.spuResult.name}`;
  }

  if (sku) {
    return `${skuResult.skuName}${skuResult.specifications ? ` / ${skuResult.specifications}` : ''}`;
  }

  return `${skuResult.spuResult.name} / ${skuResult.skuName}${skuResult.specifications ? ` / ${skuResult.specifications}` : ''}`;
};

// export default SkuResultSkuJsons;
