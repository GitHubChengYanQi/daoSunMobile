import { Selector } from 'antd-mobile';
import React from 'react';
import { useRequest } from '../../../util/Request';


const MySelector = ({ options, onChange=()=>{}, value, api,multiple,style,columns }) => {

  const { data } = useRequest(api, { manual: !api });

  return (
    <Selector
      style={style}
      columns={columns || 1}
      value={Array.isArray(value) ? value : [value]}
      options={options || data}
      multiple={multiple}
      onChange={(value,extend) => {
        if (multiple){
          onChange(value,extend.items);
        }else {
          onChange(value[0],extend.items[0]);
        }

      }}
    />
  );
};

export default MySelector;
