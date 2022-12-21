import React, { useImperativeHandle, useRef, useState } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../components/ToolUtil';
import { Tabs, Toast } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { skuList } from '../../../Scan/Url';
import MyEmpty from '../../../components/MyEmpty';
import SkuScreen from './components/SkuScreen';
import Screen from './components/Screen';
import { loading } from '@formily/antd/lib/__builtins__';

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
    debounceInterval,
    onChange = () => {
    },
  },
  ref,
) => {

  const listRef = useRef();

  const skuDefaultParams = { ...defaultParams, sortMap: { stockNumber: 'desc', } };

  const [skuClass, setSkuClass] = useState([]);
  const [supplys, setSupplys] = useState([]);
  const [brands, setBrands] = useState([]);
  const [states, setStates] = useState([]);
  const [position, setPsoition] = useState([]);
  const [boms, setBoms] = useState([]);
  const [overLengths, setOverLengths] = useState({});

  const [loading, setLoading] = useState(false);

  const [stockNumber, setStockNumber] = useState(0);
  const [skuNumber, setSkuNumber] = useState(0);

  const [skuData, setSkuData] = useState([]);

  const [params, setParams] = useState(skuDefaultParams);

  const sortMap = params.sortMap || {};

  const spuClassId = Array.isArray(params.spuClassIds) && params.spuClassIds[0];

  const [screen, setScreen] = useState(false);
  const [screening, setScreeing] = useState();

  const [refresh, setRefresh] = useState(false);

  const clear = () => {
    setSkuClass([]);
    setSupplys([]);
    setBrands([]);
    setBoms([]);
    setPsoition([]);
    setStates([]);
    setScreeing(false);
    setRefresh(false);
    setParams({ ...skuDefaultParams, skuName: params.skuName });
    listRef.current.submit({ ...skuDefaultParams, skuName: params.skuName });
  };

  const submit = (newParams = {}) => {
    setRefresh(false);
    setParams({ ...params, ...newParams });
    listRef.current.submit({ ...params, ...newParams });
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

    <Screen
      screening={screening}
      submit={(orderField) => {
        const order = orderField.order;
        submit({
          sortMap: {
            stockNumber: orderField.field === 'stockNumber' ? order : sortMap.stockNumber,
            spuName: orderField.field === 'spuName' ? order : sortMap.spuName,
          },
        });
      }}
      sorts={[
        { field: 'stockNumber', title: '数量', order: sortMap.stockNumber },
        { field: 'spuName', title: '名称', order: sortMap.spuName },
      ]}
      listRef={skuListRef}
      screen={screen}
      screenChange={setScreen}
      screenRef={screenRef}
      numberTitle={<>合计：<span> {skuNumber} </span>类<span> {stockNumber} </span>件</>}
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
        onLoading={setLoading}
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
      loading={loading}
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
