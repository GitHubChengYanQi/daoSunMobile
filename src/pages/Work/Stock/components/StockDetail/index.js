import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { List, Tabs, Toast } from 'antd-mobile';
import MyList from '../../../../components/MyList';
import { skuList } from '../../../../Scan/Url';
import MyAntList from '../../../../components/MyAntList';
import SkuResultSkuJsons from '../../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEllipsis from '../../../../components/MyEllipsis';
import { useModel } from 'umi';
import Screen from './components/Screen';
import MySearch from '../../../../components/MySearch';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { BellOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../../components/ToolUtil';

const StockDetail = ({ setOverflow }) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const listRef = useRef();

  const [overflowHeight, setOverflowHeight] = useState();

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

  useEffect(() => {
    const topHeight = document.getElementById('top');
    if (topHeight) {
      setOverflowHeight(topHeight.clientHeight);
    }
  }, [screen]);


  return <div style={{height:'100%'}}>
    <div id='top'>
      <div hidden={screen} className={style.search}>
        <MySearch
          historyType='stock'
          icon={<BellOutline style={{ fontSize: 20 }} />}
          placeholder='请输入关键词搜索'
          onChange={(value) => {
            submit({ ...params, skuName: value });
          }}
          onClear={() => {
            submit({ ...params, skuName: null });
          }}
        />
      </div>
      <div className={style.screen}>
        <div className={style.stockNumber}>库存总数：<span>{stockNumber}</span></div>
        <div className={style.blank} />
        <div className={ToolUtil.classNames(style.screenButton, (screen || screening) ? style.checked : '')}
             onClick={() => {
               if (screen) {
                 setOverflow('auto');
                 setFalse();
               } else {
                 setOverflow('hidden');
                 setTrue();
               }
             }}>
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
    </div>


    <div style={{ overflow: 'auto', maxHeight: `calc(100% - ${overflowHeight}px)` }}>
      <MyList
        params={params}
        ref={listRef}
        api={skuList}
        getData={setSkuData}
        data={skuData}
        response={(res) => {
          setStockNumber(res.count || 0);
          if (!res.count || res.count === 0) {
            Toast.show({ content: '没有找到匹配的物料，修改筛选条件试试', duration: 5000 });
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

              const positionsResult = item.positionsResult || [];

              const spuResult = item.spuResult || {};
              const unit = spuResult.unitResult || {};

              const imgUrl = Array.isArray(item.imgUrls) && item.imgUrls[0];

              return <List.Item key={index}>
                <div className={style.skuList}>
                  <div className={style.img}>
                    <img src={imgUrl || state.loginLogo} width={74} height={74} alt='' />
                    <div className={style.number}>{item.stockNumber}{unit.unitName}</div>
                  </div>
                  <div className={style.sku}>
                    <MyEllipsis width='100%'><SkuResultSkuJsons skuResult={item} /></MyEllipsis>
                    <div className={style.describe}>
                      <MyEllipsis width='100%'>
                        {
                          item.skuJsons
                          &&
                          item.skuJsons.length > 0
                          &&
                          item.skuJsons[0].values.attributeValues
                          &&
                          item.skuJsons.map((items) => {
                            return `${items.values.attributeValues}`;
                          }).join('/') || '--'
                        }
                      </MyEllipsis>
                    </div>
                    {positionsResult.length > 0 && <div className={style.positions}>
                      <MyEllipsis width='100%'>
                        {
                          positionsResult.map((item) => {
                            return positionResult(item);
                          }).join(' / ')
                        }
                      </MyEllipsis>
                    </div>}
                  </div>
                </div>

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
        setOverflow('auto');
        setFalse();
      }}
      onChange={(value) => {
        setScreeing(true);
        submit({ ...params, ...value });
      }}
      onClear={() => {
        setOverflow('auto');
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
  </div>;
};

export default StockDetail;