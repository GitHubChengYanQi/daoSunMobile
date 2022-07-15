import React, { useState } from 'react';
import { useRequest } from '../../../../../../../../../../../../../util/Request';
import { spuClassListSelect } from '../../../../../../../../../../Url';
import { Selector } from 'antd-mobile';
import BottomButton from '../../../../../../../../../../../../components/BottomButton';
import { MyLoading } from '../../../../../../../../../../../../components/MyLoading';
import style from '../../index.less'

const SkuClass = (
  {
    value=[],
    onChange = () => {
    },
  },
) => {

  const { loading, data } = useRequest(spuClassListSelect);

  const [items,setItems] = useState(value);

  return <div style={{ padding: 12 }}>
    {
      loading ? <MyLoading skeleton /> : <div style={{paddingBottom:60}}>
        <Selector
          columns={3}
          multiple
          className={style.selector}
          style={{
            '--checked-text-color': 'var(--adm-color-primary)',
            '--checked-color': 'var(--body--background--color)',
            '--padding': '4px 15px',
            '--color': 'transparent',
          }}
          showCheckMark={false}
          options={data || []}
          value={items.map(item=>item.value)}
          onChange={(v,{items}) => {
            setItems(items);
          }}
        />
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
      </div>
    }


  </div>;
};

export default SkuClass;
