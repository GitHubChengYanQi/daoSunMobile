import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import MyList from '../../../components/MyList';
import { partsList } from '../../Sku/SkuList/components/SkuScreen/components/Url';
import style from './index.less';
import SkuItem from '../../Sku/SkuItem';
import { Button } from 'antd-mobile';
import { ToolUtil } from '../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';

const BomAdd = () => {

  const [value, setValue] = useState();

  const [data, setData] = useState([]);

  const listRef = useRef();

  const history = useHistory();

  const defaultParams = { status: 99 };

  return <>
    <MyNavBar title='选择BOM' />
    <MySearch
      placeholder='请输入BOM相关信息'
      className={style.search}
      style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}
      value={value}
      onChange={setValue}
      onSearch={(skuName) => {
        listRef.current.submit({ ...defaultParams, skuName });
      }} />
    <MyList params={defaultParams} ref={listRef} api={partsList} data={data} getData={setData}>
      {
        data.map((item, index) => {
          return <div key={index} className={style.bomItem}>
            <SkuItem extraWidth='90px' className={style.sku} skuResult={item.skuResult} />
            <Button color='primary' fill='outline' onClick={() => {
              history.push(`/Work/OutStock/CheckBom?skuId=${item.skuId}&partsId=${item.partsId}`);
            }}>选择</Button>
          </div>;
        })
      }
    </MyList>
  </>;
};

export default BomAdd;
