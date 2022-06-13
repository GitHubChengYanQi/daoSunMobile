import React, { useState } from 'react';
import MySearch from '../../../../../../../../../../components/MySearch';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { storehousePositionsTreeView } from '../../../../../../../../../../Scan/Url';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import CheckPosition
  from '../../../../../../../../../../Work/Sku/SkuList/components/SkuScreen/components/Position/components/CheckPosition';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';

const Positions = (
  {
    onClose = () => {
    },
    onSuccess = () => {

    },
  },
) => {

  const { loading, data } = useRequest(storehousePositionsTreeView);

  const [value, onChange] = useState({});

  return <div style={{ height: '80vh',display:'flex',flexDirection:'column',paddingBottom:60 }}>

    <MySearch placeholder='搜索库位' />

    <div style={{ padding: 12, overflow: 'auto',flexGrow:1 }}>
      <CheckPosition
        value={value.id}
        onChange={(id, name) => {
          onChange({ name, id });
        }}
        data={data}
        refresh={data}
        checkShow={(item) => {
          return ToolUtil.isArray(item.children).length === 0;
        }}
      />
    </div>


    {loading && <MyLoading skeleton />}

    <BottomButton
      rightText='确定'
      leftOnClick={() => {
        onClose();
      }}
      rightDisabled={!value.id}
      rightOnClick={() => {
        onSuccess(value);
      }}
    />

  </div>;
};

export default Positions;
