export const SkuResultSkuJsons = ({ skuResult, describe }) => {

  if (!(skuResult && skuResult.spuResult)) {
    return '--';
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
      }).join(' , ') || '--'
    }`;
  }


  return `${skuResult.spuResult.name} / ${skuResult.skuName}${skuResult.specifications ? ` / ${skuResult.specifications}` : ''}`;
};

// export default SkuResultSkuJsons;
