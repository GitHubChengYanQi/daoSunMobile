import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import MyList from '../../../../../../../../../../components/MyList';
import { skuList } from '../../../../../../../../../../Scan/Url';
import SkuItem from '../../../../../../../../../Sku/SkuItem';
import BottomButton from '../../../../../../../../../../components/BottomButton';
import MySearch from '../../../../../../../../../../components/MySearch';
import { Button, Dropdown } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import SkuClass from './components/SkuClass';
import Brand from './components/Brand';
import Material from './components/Material';
import Bom from './components/Bom';
import Positions from './components/Positions';
import { DownFill } from 'antd-mobile-icons';
import MyCheck from '../../../../../../../../../../components/MyCheck';

const Spus = (
  {
    noChecked,
    value = {},
    onClose = () => {
    },
    onChange = () => {
    },
  },
) => {

  const listRef = useRef();

  const [data, setData] = useState([]);

  const [checkSkus, setCheckSkus] = useState([]);
  const skuIds = checkSkus.map(item => item.skuId);

  const spus = [];

  data.forEach(item => {
    const spuIds = spus.map(item => item.spuId);
    const spuIndex = spuIds.indexOf(item.spuId);
    if (spuIndex !== -1) {
      const spu = spus[spuIndex];
      spus[spuIndex] = { ...spu, skus: [...spu.skus, item] };
    } else {
      spus.push({
        spuId: item.spuId,
        name: ToolUtil.isObject(item.spuResult).name,
        skus: [item],
      });
    }
  });

  const [dropKey, setDropkey] = useState();

  const [params, setParams] = useState(value);

  const materials = params.materials || [];
  const skuClasses = params.skuClasses || [];
  const brands = params.brands || [];
  const positions = params.positions || [];
  const bom = params.bom || {};

  const filters = [
    { title: '材质', key: 'material' },
    { title: '分类', key: 'skuClass' },
    { title: '品牌', key: 'brand' },
    { title: 'BOM', key: 'bom' },
    { title: '库位', key: 'position' },
  ];

  const dropTitles = (key) => {
    if (dropKey === key) {
      return <>
        <div className={style.checkedStyle}>
          <svg viewBox='0 0 30 30' className={style.leftCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                fill='var(--adm-color-white)'
                transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
          <svg viewBox='0 0 30 30' className={style.rightCorner}>
            <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <path
                d='M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z'
                fill='var(--adm-color-white)'
                transform='translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) ' />
            </g>
          </svg>
        </div>
      </>;
    }
  };

  const submit = (newParams = {}, data = {}) => {
    setParams({ ...params, ...newParams });
    setDropkey(null);
    listRef.current.submit({
      materialIds: materials.map(item => item.value),
      spuClassIds: skuClasses.map(item => item.value),
      brandIds: brands.map(item => item.value),
      partsSkuId: bom.key,
      selectBom: params.selectBom,
      storehousePositionsIds: positions.map(item => item.id),
      skuName: params.skuName,
      ...data,
    });
  };

  useEffect(() => {
    submit();
  }, []);

  return <>
    <div className={style.content}>
      <MySearch
        placeholder='请输入物料相关信息'
        className={style.search}
        onSearch={(skuName) => {
          submit({ skuName }, { skuName });
        }}
        onClear={() => {
          submit({ skuName: '' }, { skuName: '' });
        }}
      />
      <Dropdown activeKey={dropKey} className={ToolUtil.classNames(style.dropDown)} onChange={setDropkey}>
        {
          filters.map((item) => {
            let content;
            let title;
            switch (item.key) {
              case 'material':
                content = <Material value={materials} onChange={(materials) => {
                  submit({ materials }, { materialIds: materials.map(item => item.value) });
                }} />;
                title = materials.map(item => item.label).join(',');
                break;
              case 'skuClass':
                content = <SkuClass value={skuClasses} onChange={(skuClasses) => {
                  submit({ skuClasses }, { spuClassIds: skuClasses.map(item => item.value) });
                }} />;
                title = skuClasses.map(item => item.label).join(',');
                break;
              case 'brand':
                content = <Brand value={brands} onChange={(brands) => {
                  submit({ brands }, { brandIds: brands.map(item => item.value) });
                }} />;
                title = brands.map(item => item.label).join(',');
                break;
              case 'bom':
                content = <Bom value={bom} selectBom={params.selectBom} onChange={(bom, selectBom) => {
                  submit({ bom, selectBom }, { partsSkuId: bom.key, selectBom });
                }} />;
                title = bom.title;
                break;
              case 'position':
                content = <Positions value={positions} onChange={(positions) => {
                  submit({ positions }, { storehousePositionsIds: positions.map(item => item.id) });
                }} />;
                title = positions.map(item => item.name).join(',')
                break;
              default:
                content = <></>;
                break;
            }
            return <Dropdown.Item
              destroyOnClose
              arrow
              className={ToolUtil.classNames(dropKey === item.key ? style.click : (title && style.checked))}
              key={item.key}
              title={<>
                <div className={style.titleBox}>
                  <div className={style.title}>{title || item.title}</div>
                  <DownFill />
                </div>
                {dropTitles(item.key)}
              </>}>
              <div className={style.downContent}>
                {content}
              </div>
            </Dropdown.Item>;
          })
        }
      </Dropdown>
      <div className={style.spus}>
        <MyList
          ref={listRef}
          api={skuList}
          getData={setData}
          data={data}
        >
          {
            spus.map((item, index) => {
              const skus = item.skus || [];
              return <div key={index} className={style.spuItem}>
                <div className={style.spu}>
                  <div className={style.name}>{item.name}</div>
                  {!noChecked && <Button color='primary' fill='outline' onClick={() => {
                    onChange({ ...params, spuId: item.spuId, name: item.name });
                  }}>选择</Button>}
                </div>
                {
                  skus.map((item, index) => {
                    const checked = skuIds.includes(item.skuId);
                    return <div key={index} className={style.skuItem}>
                      {!noChecked && <MyCheck checked={checked} fontSize={22} onChange={() => {
                        setCheckSkus(checked ? checkSkus.filter(skuItem => skuItem.skuId !== item.skuId) : [...checkSkus, item]);
                      }} />}
                      <SkuItem
                        extraWidth='60px'
                        skuResult={item}
                        otherData={[ToolUtil.isArray(item.brandResults).map(item => item.brandName).join('`、')]}
                      />
                    </div>;
                  })
                }
              </div>;
            })
          }
        </MyList>
      </div>

    </div>
    <BottomButton
      leftOnClick={() => {
        onClose();
      }}
      rightText={params.key !== undefined ? '修改' : '确认'}
      rightOnClick={() => {
        onChange(params, checkSkus);
      }}
    />
  </>;
};

export default Spus;
