import React, { useEffect } from 'react';
import { productionPlanDetail } from '../components/Url';
import { useRequest } from '../../../../util/Request';

const ProductionDetail = (props) => {
  const params = props.location.query;

  const {loading, data, run} = useRequest(productionPlanDetail, {manual: true});

  console.log(data);

  useEffect(()=>{
    if (params.id){
      run({data: {productionPlanId: params.id}});
    }
  },[])

  return <></>;
};

export default ProductionDetail;
