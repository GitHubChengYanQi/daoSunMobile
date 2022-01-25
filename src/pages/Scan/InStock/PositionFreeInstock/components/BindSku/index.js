import React, { useState } from 'react';
import { Selector } from 'antd-mobile';
import { useRequest } from '../../../../../../util/Request';

const BindSku = () => {

  // const [data,setData] = useState([]);
  //
  // const { loading: skuLoading, run: skuRun } = useRequest({
  //   url: '/sku/list?limit=10',
  //   method: 'POST',
  // }, {
  //   manual: true,
  //   onSuccess: (res) => {
  //     setData(res);
  //   },
  // });
  //
  //
  // return <>
  //
  //   <Selector
  //     value={keys.map((item) => {
  //       return item.value;
  //     })}
  //     columns={1}
  //     options={options() || []}
  //     multiple={true}
  //     onChange={(arr, extend) => {
  //       setKeys(extend.items);
  //     }}
  //   />
  //
  // </>
};

export default BindSku;
