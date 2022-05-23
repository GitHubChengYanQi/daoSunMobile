import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { Button, SideBar } from 'antd-mobile';
import SkuClass from './components/SkuClass';
import Supply from './components/Supply';
import Brand from './components/Brand';
import State from './components/State';
import Position from './components/Position';
import Bom from './components/Bom';
import { useThrottleFn } from 'ahooks';
import { ToolUtil } from '../../../../../../components/ToolUtil';

const Screen = (
  {
    overLengths,
    screen,
    refresh,
    stockNumber,
    search = {},
    onChange = () => {
    },
    onClose = () => {
    },
    onClear = () => {
    },
    params,
  }) => {

  const searchtype = [
    { key: 'skuClass', title: '分类' },
    { key: 'supply', title: '供应商' },
    { key: 'brand', title: '品牌' },
    { key: 'state', title: '状态' },
    { key: 'position', title: '库位' },
    { key: 'bom', title: '物料清单' },
  ];

  const [activeKey, setActiveKey] = useState();

  const [checked, setChecked] = useState();

  const paramsOnChange = (data) => {
    onChange(data);
  };

  const spuClassIds = ToolUtil.isArray(params.spuClassIds);
  const customerIds = ToolUtil.isArray(params.customerIds);
  const brandIds = ToolUtil.isArray(params.brandIds);
  const statusIds = ToolUtil.isArray(params.statusIds);
  const partsSkuId = params.partsSkuId;
  const storehousePositionsIds = ToolUtil.isArray(params.storehousePositionsIds);

  const { run: handleScroll } = useThrottleFn(
    () => {
      if (checked) {
        return;
      }
      let currentKey = searchtype[0].key;
      for (const item of searchtype) {
        const element = document.getElementById(item.key);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= 46) {
          currentKey = item.key;
        } else {
          break;
        }
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );

  const mainElementRef = useRef(null);

  useEffect(() => {
    const mainElement = mainElementRef.current;
    if (!mainElement) return;
    mainElement.addEventListener('scroll', handleScroll);
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getOptions = (key) => {
    switch (key) {
      case 'skuClass':
        return search.skuClass || [];
      case 'supply':
        return search.supplys || [];
      case 'brand':
        return search.brands || [];
      case 'state':
        return search.states || [];
      case 'position':
        return search.position || [];
      case 'bom':
        return search.boms || [];
      default:
        return [];
    }
  };

  const screenContent = (item) => {
    switch (item.key) {
      case 'skuClass':
        return <SkuClass
          refresh={refresh}
          options={getOptions(item.key).map(item => {
            return { label: item.title, value: item.key };
          })}
          title={item.title}
          value={params.spuClassIds}
          onChange={(spuClassIds) => {
            paramsOnChange({ ...params, spuClassIds });
          }}
        />;
      case 'supply':
        const supply = getOptions(item.key).map(item => {
          return { label: item.title, value: item.key };
        });
        return <Supply
          overLength={overLengths.supply && supply.length === 0}
          refresh={refresh}
          title={item.title}
          options={supply}
          value={params.customerIds}
          onChange={(customerIds) => {
            paramsOnChange({ ...params, customerIds });
          }}
        />;
      case 'brand':
        const brand = getOptions(item.key).map(item => {
          return { label: item.title, value: item.key };
        });
        return <Brand
          refresh={refresh}
          options={brand}
          title={item.title}
          value={params.brandIds}
          overLength={overLengths.brand && brand.length === 0}
          onChange={(brandIds) => {
            paramsOnChange({ ...params, brandIds });
          }}
        />;
      case 'state':
        return <State
          options={getOptions(item.key).map(item => {
            return { label: item.title, value: item.key };
          })}
          title={item.title}
          value={params.statusIds}
          onChange={(statusIds) => {
            paramsOnChange({ ...params, statusIds });
          }}
        />;
      case 'position':
        return <Position
          options={getOptions(item.key)}
          title={item.title}
          refresh={refresh}
          onChange={(storehousePositionsIds) => {
            paramsOnChange({ ...params, storehousePositionsIds });
          }}
          value={params.storehousePositionsIds}
        />;
      case 'bom':
        return <Bom
          refresh={refresh}
          options={getOptions(item.key)}
          title={item.title}
          value={params.partsSkuId}
          onChange={(partsSkuId, type) => {
            paramsOnChange({ ...params, partsSkuId, selectBom: type });
          }}
        />;
      default:
        return <></>;
    }
  };

  return <>
    <div hidden={!screen} className={style.screenDiv} style={{ top: !ToolUtil.isQiyeWeixin() ? 90 : 45 }}>
      <div className={style.content}>
        <SideBar
          className={style.sideBar}
          activeKey={activeKey}
          onChange={key => {
            setChecked(true);
            if (document.getElementById(key)) {
              document.getElementById(key).scrollIntoView();
            }
            setActiveKey(key);
            setTimeout(() => {
              setChecked(false);
            }, 1000);
          }}
        >
          {searchtype.map(item => {
            let screened = false;
            let overLength = false;
            switch (item.key) {
              case 'skuClass':
                screened = spuClassIds.length > 0;
                break;
              case 'supply':
                screened = customerIds.length > 0;
                overLength = overLengths.supply;
                break;
              case 'brand':
                screened = brandIds.length > 0;
                overLength = overLengths.brand;
                break;
              case 'state':
                screened = statusIds.length > 0;
                break;
              case 'bom':
                screened = partsSkuId;
                break;
              case 'position':
                screened = storehousePositionsIds.length > 0;
                break;
              default:
                return <></>;
            }
            return <SideBar.Item
              disabled={item.key === 'bom' ? getOptions(item.key).length === 0 : (getOptions(item.key).length <= 1 && !screened && !overLength)}
              key={item.key}
              title={<div className={style.sideBarTitle}>
                {screened && <div className={style.screened} />}
                <div>{item.title}</div>
              </div>}
            />;
          })}
        </SideBar>
        <div className={style.screenContent} ref={mainElementRef}>
          {
            searchtype.map((item, idnex) => {
              return <div id={item.key} key={idnex}>
                {screenContent(item)}
              </div>;
            })
          }
          <div style={{ height: '100%' }} />
        </div>
      </div>
      <div className={style.buttons}>
        <Button
          className={ToolUtil.classNames(style.close, style.button)}
          color='primary'
          fill='outline'
          onClick={() => {
            onClear();
          }}>
          清空
        </Button>
        <Button
          className={ToolUtil.classNames(style.ok, style.button)}
          color='primary'
          onClick={() => {
            onClose();
          }}>
          {stockNumber === 0 ? '完成' : `查看 ${stockNumber} 件物料`}
        </Button>
      </div>
      <div className={style.make} onClick={onClose} />
    </div>
  </>;
};

export default Screen;
