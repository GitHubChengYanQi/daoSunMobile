import React, { useImperativeHandle, useRef, useState } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../components/ToolUtil';
import { CopyFilled, FilterOutlined } from '@ant-design/icons';
import { Tabs, Toast } from 'antd-mobile';
import MyList from '../../../components/MyList';
import { skuList } from '../../../Scan/Url';
import { useBoolean } from 'ahooks';
import MyEmpty from '../../../components/MyEmpty';
import SkuScreen from './components/SkuScreen';
import Icon from '../../../components/Icon';

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

  const [screen, { setFalse, setTrue }] = useBoolean(false);
  const [screening, setScreeing] = useState();

  const [refresh, setRefresh] = useState(false);

  const [sort, setSort] = useState({ field:'createTime', order:'descend' });

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

  const sortAction = (field) => {
    let order = 'descend';
    if (sort.field === field) {
      switch (sort.order) {
        case 'ascend':
          if (field === 'createTime'){
            order = 'descend'
          }else {
            order = '';
          }
          break;
        case 'descend':
          order = 'ascend';
          break;
        default:
          order = 'descend';
          break;
      }
    }
    setSort({ field, order });
    submit({}, { field, order });
  };

  const sortShow = (field) => {

    if (sort.field !== field) {
      return <Icon type='icon-paixu' />;
    }

    switch (sort.order) {
      case  'ascend' :
        return <Icon type='icon-paixubeifen' />;
      case  'descend' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  const skuListRef = useRef();
  const screenRef = useRef();

  return <>
    <div
      className={style.screen}
      ref={screenRef}
    >
      <div className={style.stockNumber}>{numberTitle}：<span>{stock ? stockNumber : skuNumber}</span></div>
      <div className={style.blank} />
      <div className={style.checking} hidden={!openBatch} onClick={() => {
        onBatch(!batch);
      }}>
        {batch ? '单件' : '批量'}添加 <CopyFilled />
      </div>
      <div className={style.sort} hidden={noSort} onClick={() => {
        sortAction('stockNumber');
      }}>
        库存数量
        {sortShow('stockNumber')}
      </div>
      <div className={style.sort} hidden={noSort} onClick={() => {
        sortAction('createTime');
      }}>
        创建时间
        {sortShow('createTime')}
      </div>
      <div
        className={ToolUtil.classNames(style.screenButton, screen && style.checked, screening && style.checking)}
        onClick={() => {
          if (screen) {
            skuListRef.current.removeAttribute('style');
            setFalse();
          } else {
            skuListRef.current.setAttribute('style', 'min-height:100vh');
            screenRef.current.scrollIntoView();
            setTrue();
          }
        }}
      >
        筛选 <Icon type='icon-shaixuan' />
        <div>
          <svg viewBox='0 0 30 30' className={style.leftCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                    fill='var(--adm-color-white)'
                    transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
          <svg viewBox='0 0 30 30' className={style.rightCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                    fill='var(--adm-color-white)'
                    transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
        </div>


      </div>
    </div>

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
        setFalse();
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
