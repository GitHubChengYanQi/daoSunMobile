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
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import LinkButton from '../../../../../../../../../../components/LinkButton';
import SearchInkind from '../../../../../../../../../../components/InkindList/components/SearchInkind';
import { useHistory } from 'react-router-dom';

const Spus = (
  {
    inkind,
    noChecked,
    value = {},
    onClose = () => {
    },
    onChange = () => {
    },
    backTitle,
  },
) => {

  const history = useHistory();

  const listRef = useRef();

  const [searchValue, setSearchValue] = useState();

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
  const boms = params.boms || [];

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
      partsSkuId: boms[0] && boms[0].key,
      selectBom: params.selectBom,
      storehousePositionsIds: positions.map(item => item.id),
      skuName: params.skuName,
      ...data,
    }, {
      field: 'spuId',
      order: 'ascend',
    });
  };

  const [errorSku, setErrorSku] = useState();

  useEffect(() => {
    submit();
    ToolUtil.back({
      title:backTitle,
      key: 'spus',
      onBack: onClose,
    });
  }, []);

  const select = (params, checkSkus) => {
    onChange(params, checkSkus);
    history.goBack();
  };

  return <>
    <div className={style.content}>
      <MySearch
        value={searchValue}
        onChange={setSearchValue}
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
                content = <Bom value={boms} selectBom={params.selectBom} onChange={(boms, selectBom) => {
                  submit({ boms, selectBom }, { partsSkuId: boms[0] && boms[0].key, selectBom });
                }} />;
                title = boms.map(item => item.title).join(',');
                break;
              case 'position':
                content = <Positions value={positions} onChange={(positions) => {
                  submit({ positions }, { storehousePositionsIds: positions.map(item => item.id) });
                }} />;
                title = positions.map(item => item.name).join(',');
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
                  {dropKey === item.key ? <UpOutline /> : <DownOutline />}
                </div>
                {dropTitles(item.key)}
              </>}>
              <div className={style.space} />
              <div className={style.downContent}>
                {content}
              </div>
            </Dropdown.Item>;
          })
        }
      </Dropdown>
      <div className={style.spus}>
        <MyList
          manual
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
                    select({ ...params, spuId: item.spuId, name: item.name });
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
                        otherData={[
                          ToolUtil.isArray(item.brandResults).map(item => item.brandName).join('、'),
                          inkind && item.stockNumber > 0 && <LinkButton onClick={() => {
                            setErrorSku({
                              skuId: item.skuId,
                              skuResult: item,
                            });
                          }}>选择实物</LinkButton>,
                        ]}
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

    <SearchInkind
      className={style.inkindList}
      skuInfo={errorSku}
      onClose={() => setErrorSku(false)}
      visible={errorSku}
      onSuccess={(inkindList = []) => {
        let sku = {};
        inkindList.forEach(item => {
          sku = {
            ...ToolUtil.isObject(item.skuResult), ...item,
            inkindIds: inkindList.map(item => item.inkindId),
            number: (sku.number || 0) + item.number,
          };
        });
        select(params, [sku]);
        setErrorSku(false);
      }}
    />

    <BottomButton
      leftOnClick={() => {
        history.goBack();
      }}
      rightText={params.key !== undefined ? '修改' : '确认'}
      rightOnClick={() => {
        select(params, checkSkus);
      }}
    />
  </>;
};

export default Spus;
