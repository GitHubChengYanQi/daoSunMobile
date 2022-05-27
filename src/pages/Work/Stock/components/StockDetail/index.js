import React, { useRef, useState } from 'react';
import style from './index.less';
import { List, Tabs, Toast } from 'antd-mobile';
import MyList from '../../../../components/MyList';
import { skuList } from '../../../../Scan/Url';
import MyAntList from '../../../../components/MyAntList';
import MyEllipsis from '../../../../components/MyEllipsis';
import Screen from './components/Screen';
import MySearch from '../../../../components/MySearch';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { BellOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../../components/ToolUtil';
import SkuItem from '../../../Sku/SkuItem';

const StockDetail = () => {

  const listRef = useRef();

  const [skuClass, setSkuClass] = useState([]);
  const [supplys, setSupplys] = useState([]);
  const [brands, setBrands] = useState([]);
  const [states, setStates] = useState([]);
  const [position, setPsoition] = useState([]);
  const [boms, setBoms] = useState([]);
  const [overLengths, setOverLengths] = useState({});

  const [stockNumber, setStockNumber] = useState(0);

  const [skuData, setSkuData] = useState([]);

  const [params, setParams] = useState({ stockView: true });

  const [skuName, setSkuName] = useState('');

  const spuClassId = Array.isArray(params.spuClassIds) && params.spuClassIds[0];

  const [screen, { setFalse, setTrue }] = useBoolean();
  const [screening, setScreeing] = useState();

  const [refresh, setRefresh] = useState(false);

  const positionResult = (data) => {

    if (!data) {
      return '';
    }

    if (!data.supper) {
      return data.name;
    }

    return `${positionResult(data.supper)}-${data.name}`;
  };

  const submit = async (newParams) => {
    setRefresh(false);
    setParams(newParams);
    await listRef.current.submit({
      ...newParams,
    });
  };

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


  return <>
    <div className={style.search}>
      <MySearch
        historyType='stock'
        icon={<BellOutline style={{ fontSize: 20 }} />}
        placeholder='请输入关键词搜索'
        onSearch={(value) => {
          submit({ ...params, skuName: value });
        }}
        onChange={setSkuName}
        value={skuName}
        onClear={() => {
          submit({ ...params, skuName: null });
        }}
      />
    </div>
    <div
      className={style.screen}
      id='screen'
      onClick={() => {
        if (screen) {
          setFalse();
        } else {
          document.getElementById('screen').scrollIntoView();
          setTrue();
        }
      }}
    >
      <div className={style.stockNumber}>库存总数：<span>{stockNumber}</span></div>
      <div className={style.blank} />
      <div className={ToolUtil.classNames(style.screenButton, (screen || screening) ? style.checked : '')}>
        筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
      </div>
    </div>
    <Tabs activeKey={spuClassId || 'all'} className={style.skuClass} onChange={(key) => {
      submit({ ...params, spuClassIds: key === 'all' ? [] : [key] });
    }}>
      <Tabs.Tab title={<span className={!spuClassId && style.classCheck || ''}>全部</span>} key='all' />
      {skuClass.map((item) => {
        return <Tabs.Tab
          title={<span className={spuClassId === item.key && style.classCheck || ''}>{item.title}</span>}
          key={item.key} />;
      })}
    </Tabs>


    <div style={{minHeight:'100vh'}}>
      <MyList
        params={params}
        ref={listRef}
        api={skuList}
        getData={setSkuData}
        data={skuData}
        response={(res) => {
          setStockNumber(res.count || 0);
          if (!res.count || res.count === 0) {
            Toast.show({ content: '没有找到匹配的物料，修改筛选条件试试', duration: 3000 });
          }
          const resSearch = res.search || [];
          let overs = {};
          resSearch.map(item => {
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
        <MyAntList>
          {
            skuData.map((item, index) => {

              const positions = item.positionsResult || [];

              const spuResult = item.spuResult || {};
              const unit = spuResult.unitResult || {};

              return <List.Item key={index} className={style.listItem}>
                <SkuItem
                  extraWidth='24px'
                  number={item.stockNumber}
                  unitName={unit.unitName}
                  skuResult={item}
                  otherData={positions.length > 0 && <MyEllipsis width='100%'>
                    {
                      positions.map((item) => {
                        return positionResult(item);
                      }).join(' / ')
                    }
                  </MyEllipsis>}
                />
              </List.Item>;
            })
          }


        </MyAntList>
      </MyList>
    </div>
    <Screen
      screen={screen}
      overLengths={overLengths}
      refresh={refresh}
      stockNumber={stockNumber}
      params={params}
      search={{ skuClass, supplys, brands, states, position, boms }}
      onClose={() => {
        setFalse();
      }}
      onChange={(value) => {
        setScreeing(true);
        submit({ ...params, ...value });
      }}
      onClear={() => {
        setSkuClass([]);
        setSupplys([]);
        setBrands([]);
        setBoms([]);
        setPsoition([]);
        setStates([]);
        setScreeing(false);
        submit({ stockView: true, skuName: params.skuName });
      }}
    />
  </>;
};

export default StockDetail;
