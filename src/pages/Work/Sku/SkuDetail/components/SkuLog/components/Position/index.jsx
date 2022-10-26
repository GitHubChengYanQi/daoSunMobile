import React, { useState } from 'react';
import { Card, Divider } from 'antd-mobile';
import MySearch from '../../../../../../../components/MySearch';
import { MyLoading } from '../../../../../../../components/MyLoading';
import CheckPosition from '../../../../../SkuList/components/SkuScreen/components/Position/components/CheckPosition';
import { useRequest } from '../../../../../../../../util/Request';
import { positions } from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import style from '../../../../../SkuList/components/SkuScreen/index.less';

const Position = (
  {
    title,
    value,
    onChange = () => {
    },
  },
) => {

  const { loading, data, run } = useRequest(positions);

  const [name, setName] = useState();

  return <div className={style.content}>
    <Card
      title={<Divider contentPosition='left' className={style.divider}>{title}</Divider>}
      headerStyle={{ border: 'none' }}
    >
      <MySearch
        className={style.searchBar}
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
          value={value}
          onChange={onChange}
          data={data}
          refresh={data}
        />}
      </div>
    </Card>

  </div>;
};

export default Position;
