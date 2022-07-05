import React, { useImperativeHandle, useRef, useState } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../components/ToolUtil';
import { CopyFilled } from '@ant-design/icons';
import { Tabs, Toast } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { skuList } from '../../../Scan/Url';
import MyEmpty from '../../../components/MyEmpty';
import SkuScreen from './components/SkuScreen';
import ListScreent from './components/ListScreent';

const SkuList = (
  {
    SkuContent,
    skuContentProps,
    skuClassName,
    open = {},
    defaultParams = {},
    numberTitle = '库存总数',
    noSort,
    stock,
    onBatch = () => {
    },
    openBatch,
    batch,
    onChange = () => {
    },
  },
  ref,
) => {

  const listRef = useRef();

  const [skuClass, setSkuClass] = useState([]);
  const [supplys, setSupplys] = useState([]);
  const [brands, setBrands] = useState([]);
  const [states, setStates] = useState([]);
  const [position, setPsoition] = useState([]);
  const [boms, setBoms] = useState([]);
  const [overLengths, setOverLengths] = useState({});

  const [stockNumber, setStockNumber] = useState(0);
  const [skuNumber, setSkuNumber] = useState(0);

  const [skuData, setSkuData] = useState([]);

  const [params, setParams] = useState(defaultParams);

  const spuClassId = Array.isArray(params.spuClassIds) && params.spuClassIds[0];

  const [screen, setScreen] = useState(false);
  const [screening, setScreeing] = useState();

  const [refresh, setRefresh] = useState(false);

  const [sort, setSort] = useState({ field: 'createTime', order: 'descend' });

  const clear = () => {
    setSkuClass([]);
    setSupplys([]);
    setBrands([]);
    setBoms([]);
    setPsoition([]);
    setStates([]);
    setScreeing(false);
    setRefresh(false);
    setParams({ ...defaultParams, skuName: params.skuName });
    setSort({});
    listRef.current.submit({ ...defaultParams, skuName: params.skuName });
  };

  const submit = (newParams = {}, newSort = {}) => {
    setRefresh(false);
    setParams({ ...params, ...newParams });
    listRef.current.submit({ ...params, ...newParams }, { ...sort, ...newSort });
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  const search = (oldArray, newArray, screened, overLength) => {
    if (screened && overLength) {
      return oldArray;
    }
    if (oldArray.length === 0 || !screened) {
      return newArray;
    }
    const keys = newArray.map(item => item.key);
    return oldArray.filter(item => {
      return keys.includes(item.key);
    });
  };

  const skuListRef = useRef();
  const screenRef = useRef();

  return <>

    <ListScreent
      setSort={setSort}
      sort={sort}
      screening={screening}
      submit={submit}
      onlySorts={['createTime']}
      sorts={noSort ? [] : [{ field: 'stockNumber', title: '数量' }, { field: 'createTime', title: '时间' }]}
      listRef={skuListRef}
      screen={screen}
      screenChange={setScreen}
      screenRef={screenRef}
      actions={<div className={style.checking} hidden={!openBatch} onClick={() => {
        onBatch(!batch);
      }}>
        {batch ? '单件' : '批量'}添加 <CopyFilled />
      </div>}
      numberTitle={<>{numberTitle}：<span>{stock ? stockNumber : skuNumber}</span></>}
    />

    <Tabs stretch={false} activeKey={spuClassId || 'all'} className={style.skuClass} onChange={(key) => {
      submit({ spuClassIds: key === 'all' ? [] : [key] });
    }}>
      <Tabs.Tab title={<span className={!spuClassId && style.classCheck || ''}>全部</span>} key='all' />
      {skuClass.map((item) => {
        return <Tabs.Tab
          title={<span className={spuClassId === item.key && style.classCheck || ''}>{item.title}</span>}
          key={item.key} />;
      })}
    </Tabs>


    <div ref={skuListRef} className={ToolUtil.classNames(style.skuList, skuClassName)}>
      <MyList
        params={params}
        ref={listRef}
        api={skuList}
        getData={(data) => {
          setSkuData(data);
          onChange(data);
        }}
        data={skuData}
        response={(res) => {
          setSkuNumber(res.count || 0);
          if (!res.count || res.count === 0) {
            Toast.show({ content: '没有找到匹配的物料，修改筛选条件试试', duration: 2000 });
          }
          const resSearch = res.search || [];
          let overs = {};
          resSearch.map(item => {
            if (!item) {
              return null;
            }

            if (item.stockCount) {
              setStockNumber(item.stockCount || 0);
            }
            const array = item.objects || [];
            const typeEnum = item.typeEnum;
            switch (item.key) {
              case 'spuClass':
                const spuClassIds = params.spuClassIds || [];
                return setSkuClass(search(skuClass, array, spuClassIds.length > 0));
              case 'customer':
                const customerIds = params.customerIds || [];
                const supply = typeEnum === 'overLength';
                overs = { ...overs, supply };
                return setSupplys(search(supplys, array, customerIds.length > 0, supply));
              case 'brand':
                const brandIds = params.brandIds || [];
                const brand = typeEnum === 'overLength';
                overs = { ...overs, brand };
                return setBrands(search(brands, array, brandIds.length > 0, brand));
              case 'bom':
                const partsSkuId = params.partsSkuId;
                return setBoms(search(boms, array, partsSkuId));
              case 'position':
                const storehousePositionsId = params.storehousePositionsId;
                return setPsoition(search(position, array, storehousePositionsId));
              case 'status':
                const statusIds = params.statusIds || [];
                return setStates(search(states, array, statusIds.length));
              default:
                return null;
            }
          });
          setOverLengths(overs);
          setRefresh(true);
        }}
      >
        {SkuContent ? <SkuContent data={skuData} batch={batch} {...skuContentProps} /> : <MyEmpty />}
      </MyList>
    </div>

    <SkuScreen
      screen={screen}
      overLengths={overLengths}
      refresh={refresh}
      skuNumber={skuNumber}
      params={params}
      search={{ skuClass, supplys, brands, states, position, boms }}
      onClose={() => {
        skuListRef.current.removeAttribute('style');
        setScreen(false);
      }}
      onChange={(value) => {
        setScreeing(true);
        submit({ ...value });
      }}
      onClear={clear}
      open={open}
    />
  </>;
};

export default React.forwardRef(SkuList);
