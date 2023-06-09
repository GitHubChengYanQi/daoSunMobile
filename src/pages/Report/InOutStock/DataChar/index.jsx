import React, { useRef, useState } from 'react';
import style from '../index.less';
import { Button, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { message } from 'antd';
import { DownOutline } from 'antd-mobile-icons';
import MyCheck from '../../../components/MyCheck';
import SkuItem from '../../../Work/Sku/SkuItem';
import MyRadio from '../../../components/MyRadio';
import { MyDate } from '../../../components/MyDate';
import moment from 'moment';
import ShowBrand from './components/ShowBrand';
import ShowSupply from './components/ShowSupply';
import ShowUser from './components/ShowUser';
import MyPicker from '../../../components/MyPicker';
import { getDate } from '../components/SearchTime';
import MyList from '../../../components/MyList';
import StartEndDate from '../../../components/StartEndDate';

export const InStockExport = { url: '/viewExcel/export', method: 'POST' };
export const InStockDataList = { url: '/statisticalView/instockView', method: 'POST' };

export const outUserList = { url: '/statisticalView/outstockViewTotail', method: 'POST' };

const DataChar = (
  {
    searchParams = {},
    setSearchParams = () => {
    },
    openSearch = () => {
    },
    date = [],
  },
) => {

  const dataRef = useRef();

  const inStock = searchParams.type === 'inStock';

  const [data, setData] = useState([]);

  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const [ids, setIds] = useState([]);

  const [showId, setShowId] = useState();

  const [visible, setVisible] = useState('');

  const { loading: exportLoading, run: exportRun } = useRequest(InStockExport, {
    manual: true,
    onSuccess: () => {
      message.success('导出成功！请注意查收');
    },
    onError: () => message.error('导出失败！请联系管理员'),
  });

  const getListInfo = (type, item = {}) => {
    switch (type) {
      case 'outSku':
        let number = 0;
        isArray(item.userAndNumbers).forEach(item => number += item.number);
        return {
          number,
          skuResult: item.skuResult,
          api: outUserList,
          params: { viewMode: 'sku' },
        };
      case 'inSku':
        return {
          number: isArray(item.instockLists)[0]?.number,
          skuResult: isArray(item.instockLists)[0]?.skuResult,
          // list: item.userAndNumbers,
          api: InStockDataList,
          // params: { viewMode: 'sku' },
        };
      case 'outUser':
        return {
          key: item.userResult?.userId,
          skus: item.skuAndNumbers,
          api: outUserList,
          params: { viewMode: 'pickUser' },
        };
      case 'inSupply':
        return {
          key: item.customerId,
          skus: item.instockLists,
          api: InStockDataList,
          // params: { viewMode: 'pickUser' },
        };
      default:
        return {};
    }
  };
  const list = () => {

    if (['supply', 'userId'].includes(searchParams.dimension)) {

      let type = '';
      if (searchParams.dimension === 'supply') {
        type = 'inSupply';
      } else {
        type = 'outUser';
      }

      return <MyList
        topBottom='140px'
        api={getListInfo(type).api}
        getData={setData}
        data={data}
        params={getListInfo(type).params}
      >
        {
          data.map((item, index) => {
            const key = getListInfo(type, item).key;
            const show = showId === key;
            const skuItems = isArray(getListInfo(type, item).skus);
            const checked = ids.includes(index);
            return <div key={index} className={style.supply}>
              <div className={style.skuItem}>
                <div
                  className={style.check}
                  onClick={() => setIds(checked ? ids.filter(item => item !== index) : [...ids, index])}
                >
                  <MyCheck checked={checked} fontSize={18} />
                </div>
                <div className={style.sku}>{inStock ? item.customerName : item.userResult?.name || '-'}</div>
                {skuItems.length > 0 && <DownOutline onClick={() => setShowId(show ? '' : key)} />}
              </div>
              <div hidden={!show}>
                {
                  skuItems.map((item, index) => {
                    return <div key={index}>
                      <div className={style.skuItem} style={{ paddingTop: index === 0 && 0 }}>
                        <SkuItem
                          extraWidth='140px'
                          skuResult={item.skuResult}
                          className={style.sku}
                        />
                        <div>
                          <div hidden={!inStock} className={style.action}>已入库</div>
                          × {item.number}
                        </div>
                      </div>
                      <ShowBrand
                        brands={[item.brandResult]}
                        hidden={!isArray(searchParams.show).includes('brand')}
                      />
                      <div className={style.skuSpace} />
                    </div>;
                  })
                }
              </div>
            </div>;
          })
        }
      </MyList>;
    }
    let type = '';
    if (
      !inStock
      // &&
      // searchParams.dimension === 'sku'
    ) {
      type = 'outSku';
    } else {
      type = 'inSku';
    }
    return <MyList
      topBottom='140px'
      api={getListInfo(type).api}
      getData={setData}
      data={data}
      params={getListInfo(type).params}
    >
      {
        data.map((item, index) => {
          let other = '';
          if (inStock) {
            switch (searchParams.dimension) {
              case 'sku':
                other = <Space>
                  <div>到货 ×0</div>
                  <div>终止入库 <span className='red'>×0</span></div>
                </Space>;
                break;
              case 'detail':
                other = MyDate.Show(new Date());
                break;
              case 'userId':
                break;
              default:
                break;
            }
          }
          const checked = ids.includes(index);
          return <div key={index} className={style.skuList}>
            <div className={style.skuItem}>
              <div
                className={style.check}
                onClick={() => setIds(checked ? ids.filter(item => item !== index) : [...ids, index])}
              ><MyCheck checked={checked} fontSize={18} /></div>
              <SkuItem
                extraWidth='170px'
                skuResult={getListInfo(type, item).skuResult}
                className={style.sku}
                otherData={[other]}
              />
              <div>
                <div hidden={!inStock} className={style.action}>已入库</div>
                × {getListInfo(type, item).number}
              </div>
            </div>
            <ShowSupply
              supplys={[{
                customerName: item.customerName,
                brands: [isArray(item.instockLists)[0]?.brandResult],
              }]}
              hidden={!isArray(searchParams.show).includes('supply')}
              searchParams={searchParams}
            />
            <ShowBrand
              brands={[isArray(item.instockLists)[0]?.brandResult]}
              hidden={!isArray(searchParams.show).includes('brand') || isArray(searchParams.show).includes('supply')}
            />
            <ShowUser
              hidden={!isArray(searchParams.show).includes('userId')}
              users={isArray(item.userAndNumbers)}
            />
            <div className={style.skuSpace} />
          </div>;
        })
      }
    </MyList>;
  };

  return <>
    <div className={style.dimension}>
      <Space className={style.timeShow} align='end' onClick={() => setVisible('time')}>
        {searchParams.timeType === 'diy' ? (moment(date[0]).format('YYYY/MM/DD') + ' - ' + moment(date[1]).format('YYYY/MM/DD')) : searchParams.timeType}
        <DownOutline />
      </Space>

      <Space className={style.screen} onClick={openSearch} align='end'>筛选<DownOutline /></Space>
    </div>

    <div className={style.list}>
      {list()}
    </div>

    <div className={style.bottomAction} style={{ bottom: 70 }}>
      <Space className={style.radio}>
        <MyRadio checked={currentAll} onChange={() => {
          setCheckAll(false);
          setCurrentAll(true);
        }}>本页全选</MyRadio>
        <MyRadio checked={checkAll} onChange={() => {
          setCurrentAll(false);
          setCheckAll(true);
        }}>全部全选</MyRadio>
      </Space>

      <Button color='primary' onClick={() => {
        exportRun({ data: { beginTime: date[0], endTime: date[1] } });
      }}>
        导出
      </Button>
    </div>

    <MyPicker
      onClose={() => setVisible('')}
      visible={visible === 'time'}
      value={searchParams.timeType}
      options={[]}
      onChange={(option) => {
        setVisible('');
        if (option.value === 'diy') {
          dataRef.current.open();
          return;
        }
        setSearchParams({ ...searchParams, time: getDate(option.value), timeType: option.value });
      }}
    />

    <StartEndDate
      render
      minWidth='100%'
      value={searchParams.time}
      max={new Date()}
      onChange={(time) => {
        setSearchParams({
          ...searchParams,
          time: [moment(time[0]).format('YYYY/MM/DD 00:00:00'), moment(time[1]).format('YYYY/MM/DD 23:59:59')],
          timeType: 'diy',
        });
      }}
      ref={dataRef}
    />

    {(exportLoading) && <MyLoading />}

  </>;
};

export default DataChar;
