import React, { useState } from 'react';
import MyCard from '../../../components/MyCard';
import { useRequest } from '../../../../util/Request';
import { spuClassListSelect } from '../../Instock/Url';
import MyPicker from '../../../components/MyPicker';
import LinkButton from '../../../components/LinkButton';
import MySearch from '../../../components/MySearch';
import style from '../SkuList/components/SkuScreen/index.less';
import { MyLoading } from '../../../components/MyLoading';
import { Loading, Selector } from 'antd-mobile';
import { SelectorStyle } from '../../../Report/InOutStock';
import { ToolUtil } from '../../../components/ToolUtil';

export const spuList = {
  url: '/spu/list',
  method: 'POST',
  rowKey: 'spuId',
};

const CheckSpu = () => {

  const { loading: skuClassLoading, data: skuClassData = [] } = useRequest(spuClassListSelect);

  const [skuClass, setSkuClass] = useState({});

  const [visible, setVisible] = useState('');

  const [spus, setSpus] = useState([]);

  const [searchValue, setSearchValue] = useState();

  const [customers, setCustomers] = useState([]);

  const { loading, run } = useRequest(spuList, {
    defaultParams: {
      data: { supply: 1 },
      params: { limit: 10, page: 1 },
    },
    onSuccess: (res) => {
      const newArray = Array.isArray(res) ? res.map(item => {
        return {
          label: item.name,
          value: item.spuId,
        };
      }) : [];

      setSpus(newArray);
    },
  });

  const like = (string) => {
    run({
      data: { name: string },
      params: { limit: 10, page: 1 },
    });
  };

  return <>
    <MyCard
      title='分类'
      extra={skuClassLoading ? <Loading /> : <LinkButton
        onClick={() => setVisible('skuClass')}>
        {skuClass.value ? skuClass.label : '请选择物料分类'}
      </LinkButton>}
    />


    <div style={{padding:16}}>
      <MySearch
        placeholder=' 请输入供应商信息'
        className={style.searchBar}
        onSearch={(value) => {
          like(value);
        }}
        onChange={setSearchValue}
        value={searchValue}
        onClear={like}
      />
      {loading ? <MyLoading skeleton /> : <Selector
        columns={1}
        style={SelectorStyle}
        className={ToolUtil.classNames(style.supply, style.left)}
        showCheckMark={false}
        options={spus}
        onChange={(v, { items }) => {

        }}
      />}
    </div>


    <MyPicker
      visible={visible === 'skuClass'}
      value={skuClass.value}
      onChange={setSkuClass}
      options={skuClassData}
      onClose={() => setVisible('')}
    />
  </>;
};

export default CheckSpu;
