import React, { useState } from 'react';
import style from './index.less';
import { Button, Selector, Space, Tabs } from 'antd-mobile';
import StartEndDate from '../../Work/Production/CreateTask/components/StartEndDate';
import moment from 'moment';
import { RightOutline } from 'antd-mobile-icons';
import MyEllipsis from '../../components/MyEllipsis';
import MySearch from '../../components/MySearch';
import MyCard from '../../components/MyCard';
import SearchTime from './components/SearchTime';
import { useRequest } from '../../../util/Request';
import { spuClassListSelect } from '../../Work/Instock/Url';
import { MyLoading } from '../../components/MyLoading';
import { isArray } from '../../components/ToolUtil';
import DataChar from './DataChar';

export const SelectorStyle = {
  '--border': 'solid transparent 1px',
  '--checked-border': 'solid var(--adm-color-primary) 1px',
  '--padding': '4px 15px',
  '--font-size': '14px',
};

const InOutStock = () => {

  const [search, setSearch] = useState(false);

  const inStockSearch = {
    type: 'inStock',
    dimension: 'detail',
    status: ['arrival', 'in', 'stop'],
    statusName: '已到货,已入库,终止入库',
    show: ['sku'],
  };

  const outStockSearch = {
    type: 'outStock',
    dimension: 'detail',
    status: ['out'],
    statusName: '已出库',
    show: ['sku'],
  };

  const [searchParams, setSearchParams] = useState(inStockSearch);

  console.log(searchParams);

  const [date, setDate] = useState([]);


  const { loading: skuClassLoading, data: skuClass } = useRequest(spuClassListSelect);

  if (search) {
    return <>
      <MySearch placeholder='请输入相关字段' className={style.search} noSearchButton />

      <div className={style.searchContent}>
        <MyCard
          title={<>日期 <span className='red'> *</span></>}
          className={style.searchCard}
          bodyClassName={style.searchCardBody}
        >
          <SearchTime timeType={searchParams.timeType} value={searchParams.time}
                      onChange={(time, timeType) => setSearchParams({ ...searchParams, time, timeType })} />
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
              setSearchParams(v[0] === 'inStock' ? inStockSearch : outStockSearch);
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
            options={[
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
            ]}
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
                onChange={(v,{items}) => {
                  setSearchParams({
                    ...searchParams,
                    skuClass: v,
                    skuClassName: items.map(item => item.label).join(','),
                  });
                }}
              />
          }
        </MyCard>

        <div className={style.buttons}>
          <Button onClick={() => searchParams(inStockSearch)}>重置</Button>
          <Button
            color='primary'
            disabled={!(searchParams.time && searchParams.type && searchParams.dimension && isArray(searchParams.status).length > 0)}
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
    <div className={style.header}>
      <div className={style.tabs}>
        <Tabs className={style.inOutStockTabs} activeKey={searchParams.type}
              onChange={(key) => setSearchParams(key === 'inStock' ? inStockSearch : outStockSearch)}>
          <Tabs.Tab title='入库' key='inStock' />
          <Tabs.Tab title='出库' key='outStock' />
        </Tabs>
      </div>
      <div className={style.space} />
      <div className={style.time} onClick={() => setSearch(true)}>
        <MyEllipsis width={'100%'} style={{ fontSize: 12, lineHeight: '12px', textAlign: 'right' }}>
          {date.length > 0 ? (moment(date[0]).format('YYYY/MM/DD') + ' - ' + moment(date[1]).format('YYYY/MM/DD')) : '至今'}
        </MyEllipsis>
        <RightOutline style={{ fontSize: 12 }} />
      </div>
    </div>
    <DataChar
      skuClass={skuClass}
      date={date}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      openSearch={() => setSearch(true)}
    />
  </>;
};

export default InOutStock;
