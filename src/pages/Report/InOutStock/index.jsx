 import React, { useState } from 'react';
import style from './index.less';
import { Button, Selector, Space, Tabs } from 'antd-mobile';
import MyCard from '../../components/MyCard';
import SearchTime from './components/SearchTime';
import { useRequest } from '../../../util/Request';
import { spuClassListSelect } from '../../Work/Instock/Url';
import { MyLoading } from '../../components/MyLoading';
import { isArray } from '../../components/ToolUtil';
import DataChar from './DataChar';
import MySearch from '../../components/MySearch';

export const SelectorStyle = {
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 15px',
  '--font-size': '14px',
};

const InOutStock = () => {

  const [search, setSearch] = useState(true);

  const inStockSearch = {
    type: 'inStock',
    dimension: 'detail',
    status: ['arrival', 'in', 'stop'],
    show: ['sku'],
  };

  const outStockSearch = {
    type: 'outStock',
    dimension: 'detail',
    status: ['out'],
    show: ['sku'],
  };

  const [searchParams, setSearchParams] = useState(inStockSearch);

  const [date, setDate] = useState([]);


  const { loading: skuClassLoading, data: skuClass } = useRequest(spuClassListSelect);

  const shows = [
    { label: '物料', value: 'sku', disabled: true },
    {
      label: '供应商',
      value: 'supply',
      disabled: ['outStock'].includes(searchParams.type) || ['detail', 'supply'].includes(searchParams.dimension),
    },
    {
      label: '品牌',
      value: 'brand',
      disabled: ['outStock'].includes(searchParams.type) || ['detail'].includes(searchParams.dimension),
    },
    {
      label: '领料人',
      value: 'userId',
      disabled: ['inStock'].includes(searchParams.type) || ['detail', 'userId'].includes(searchParams.dimension),
    },
  ];

  if (search) {
    return <>
      <MySearch placeholder='请输入相关字段' className={style.search} noSearchButton />

      <div className={style.searchContent}>
        <MyCard
          title={<>日期 <span className='red'> *</span></>}
          className={style.searchCard}
          bodyClassName={style.searchCardBody}
        >
          <SearchTime
            timeType={searchParams.timeType}
            value={searchParams.time}
            onChange={(time, timeType) => setSearchParams({ ...searchParams, time, timeType })}
          />
        </MyCard>
        <MyCard
          title={<>类型 <span className='red'> *</span></>}
          className={style.searchCard}
          bodyClassName={style.searchCardBody}
        >
          <Selector
            columns={4}
            style={SelectorStyle}
            value={searchParams.type && [searchParams.type]}
            showCheckMark={false}
            options={[
              { label: '入库', value: 'inStock' },
              { label: '出库', value: 'outStock' },
            ]}
            onChange={(v) => {
              setSearchParams({ ...searchParams, ...(v[0] === 'inStock' ? inStockSearch : outStockSearch) });
            }}
          />
        </MyCard>
        <MyCard
          title={<>维度 <span className='red'> *</span></>}
          className={style.searchCard}
          bodyClassName={style.searchCardBody}
        >
          <Selector
            columns={4}
            style={SelectorStyle}
            value={searchParams.dimension ? [searchParams.dimension] : []}
            showCheckMark={false}
            options={[
              { label: '物料', value: 'sku' },
              { label: '供应商', value: 'supply', disabled: ['outStock'].includes(searchParams.type) },
              { label: '明细', value: 'detail' },
              { label: '领料人', value: 'userId', disabled: ['inStock'].includes(searchParams.type) },
            ]}
            onChange={(v) => {
              setSearchParams({ ...searchParams, dimension: v[0], show: ['sku'] });
            }}
          />
        </MyCard>
        <MyCard
          title={<>状态 <span className='red'> *</span></>}
          className={style.searchCard}
          bodyClassName={style.searchCardBody}
        >
          <Selector
            columns={3}
            style={SelectorStyle}
            value={searchParams.status}
            showCheckMark={false}
            multiple
            options={[
              { label: '已到货', value: 'arrival', disabled: ['outStock'].includes(searchParams.type) },
              { label: '已入库', value: 'in', disabled: ['outStock'].includes(searchParams.type) },
              { label: '终止入库', value: 'stop', disabled: ['outStock'].includes(searchParams.type) },
              { label: '已出库', value: 'out', disabled: ['inStock'].includes(searchParams.type) },
            ]}
            onChange={(v, { items }) => {
              if (searchParams.type === 'outStock') {
                return;
              }
              setSearchParams({ ...searchParams, status: v, statusName: items.map(item => item.label).join(',') });
            }}
          />
        </MyCard>
        <MyCard title='显示' className={style.searchCard} bodyClassName={style.searchCardBody}>
          <Selector
            columns={4}
            style={SelectorStyle}
            value={searchParams.show}
            showCheckMark={false}
            options={shows}
            multiple
            onChange={(v) => {
              setSearchParams({ ...searchParams, show: v });
            }}
          />
        </MyCard>
        <MyCard title='物料分类' className={style.searchCard} bodyClassName={style.searchCardBody}>
          {
            skuClassLoading ? <MyLoading skeleton /> :
              <Selector
                columns={3}
                className={style.selector}
                style={SelectorStyle}
                value={searchParams.skuClass}
                showCheckMark={false}
                multiple
                options={isArray(skuClass)}
                onChange={(v) => {
                  setSearchParams({
                    ...searchParams,
                    skuClass: v,
                  });
                }}
              />
          }
        </MyCard>

        <div className={style.buttons}>
          <Button onClick={() => setSearchParams({
            ...inStockSearch,
            time: [],
            timeType: null,
            skuClass: [],
          })}>重置</Button>
          <Button
            color='primary'
            disabled={!(searchParams.timeType && searchParams.type && searchParams.dimension && isArray(searchParams.status).length > 0)}
            onClick={() => {
              setDate(searchParams.time);
              setSearch(false);
            }}
          >确定</Button>
        </div>
      </div>
    </>;
  }

  return <>
    <MySearch placeholder='请输入相关字段' className={style.search} noSearchButton />
    <DataChar
      shows={shows}
      skuClass={skuClass}
      date={date}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      openSearch={() => setSearch(true)}
    />
  </>;
};

export default InOutStock;
