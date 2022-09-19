import React, { useState } from 'react';
import MySearch from '../../../../../../../../components/MySearch';
import CheckPosition
  from '../../../../../../../Sku/SkuList/components/SkuScreen/components/Position/components/CheckPosition';
import { useRequest } from '../../../../../../../../../util/Request';
import { positions } from '../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import style from '../../index.less';
import BottomButton from '../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../components/MyLoading';

const Positions = (
  {
    value = [],
    onChange = () => {
    },
  },
) => {

  const { loading, data, run } = useRequest(positions);

  const [name, setName] = useState();

  const [items, setItems] = useState(value);

  return <div style={{ padding: 12 }}>
    <MySearch
      className={style.filterSearch}
      placeholder='搜索库位'
      onChange={setName}
      onSearch={() => {
        run({ data: { name } });
      }}
      onClear={() => {
        run();
      }} />

    <div className={style.list} style={{ paddingBottom: 60 }}>
      {loading ? <MyLoading skeleton /> : <CheckPosition
        value={items}
        onChange={setItems}
        data={data}
        refresh={data}
      />}
    </div>
    <BottomButton
      leftText='重置'
      svg
      className={style.bottom}
      rightOnClick={() => {
        onChange(items);
      }}
      leftOnClick={() => {
        onChange([]);
      }}
    />
  </div>;
};

export default Positions;
