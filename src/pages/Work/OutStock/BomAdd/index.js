import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import MyList from '../../../components/MyList';
import { backDetails, partsList } from '../../Sku/SkuList/components/SkuScreen/components/Url';
import style from './index.less';
import SkuItem from '../../Sku/SkuItem';
import { Button, Space } from 'antd-mobile';
import { ToolUtil } from '../../../components/ToolUtil';
import { useHistory } from 'react-router-dom';
import LinkButton from '../../../components/LinkButton';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';

const BomAdd = () => {

  const [value, setValue] = useState();

  const [data, setData] = useState([]);

  const listRef = useRef();

  const history = useHistory();

  const defaultParams = { status: 99 };

  const [boms, setBoms] = useState([]);

  const [number, setNumber] = useState(0);

  const { loading, run } = useRequest(backDetails, {
    manual: true,
    onSuccess: (res) => {
      if (Array.isArray(res)) {
        setBoms([...boms, res.map(item => {
          return {
            key: item.skuId,
            skuResult: item.skuResult,
            partsId: item.partsId,
            isNull: !item.isNull,
          };
        })]);
      }
    },
  });

  const bomList = (list = []) => {
    return list.map((item, index) => {
      return <div key={index} className={style.bomItem}>
        <SkuItem extraWidth='90px' className={style.sku} skuResult={item.skuResult} />
        {!item.isNull && <Space direction='vertical' align='center'>
          <Button color='primary' fill='outline' onClick={() => {
            history.push(`/Work/OutStock/CheckBom?skuId=${item.key}&partsId=${item.partsId}`);
          }}>选择</Button>
          <LinkButton onClick={() => {
            run({ params: { id: item.key, type: 1 } });
          }}>下一级</LinkButton>
        </Space>}
      </div>;
    });
  };

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
    <div className={style.header}>
      <span>BOM数量：{boms.length === 0 ? number : boms[boms.length - 1].length}</span>
      <LinkButton disabled={boms.length === 0} className={style.back} onClick={() => {
        setBoms(boms.filter((item, index) => {
          return index !== boms.length - 1;
        }));
      }}>返回上一级</LinkButton>
    </div>
    {
      loading ? <MyLoading skeleton /> :
        <>
          {
            boms.length === 0 ?
              <MyList response={(res) => {
                setNumber(res.count);
              }} params={defaultParams} ref={listRef} api={partsList} data={data} getData={setData}>
                {bomList(data.map(item => ({ ...item, key: item.skuId })))}
              </MyList>
              :
              bomList(boms[boms.length - 1])
          }
        </>
    }
  </>;
};

export default BomAdd;
