import React, { useEffect, useRef, useState } from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import { Button, Selector, Space } from 'antd-mobile';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import { message } from 'antd';
import { classNames, isArray } from '../../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import drowStyle from '../../../Work/ProcessTask/index.less';
import MyCheck from '../../../components/MyCheck';
import SkuItem from '../../../Work/Sku/SkuItem';
import MyRadio from '../../../components/MyRadio';
import MyAntPopup from '../../../components/MyAntPopup';
import { SelectorStyle } from '../index';
import { MyDate } from '../../../components/MyDate';
import moment from 'moment';
import ShowBrand from './components/ShowBrand';
import ShowSupply from './components/ShowSupply';
import ShowUser from './components/ShowUser';
import MyPicker from '../../../components/MyPicker';
import { getDate } from '../components/SearchTime';
import StartEndDate from '../../../Work/Production/CreateTask/components/StartEndDate';

export const InStockDataList = { url: '/statisticalView/instockView', method: 'POST' };
export const InStockExport = { url: '/viewExcel/export', method: 'POST' };
export const InStockViewTotail = { url: '/statisticalView/viewTotail', method: 'POST' };

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

  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const [showId, setShowId] = useState();

  const [visible, setVisible] = useState('');

  const { loading: exportLoading, run: exportRun } = useRequest(InStockExport, {
    manual: true,
    onSuccess: () => {
      message.success('导出成功！请注意查收');
    },
    onError: () => message.error('导出失败！请联系管理员'),
  });

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({ ...InStockViewTotail, data: {} });

  useEffect(() => {
    if (date.length > 0) {
      // viewRun({ data: { beginTime: date[0], endTime: date[1] } });
      // listRef.current.submit({ beginTime: date[0], endTime: date[1] });
    }
  }, [date]);

  const list = () => {

    if (['supply', 'userId'].includes(searchParams.dimension)) {
      return [1, 2, 3].map((item, index) => {
        const show = showId === item;
        return <div key={index} className={style.supply}>
          <div className={style.skuItem}>
            <div className={style.check}><MyCheck fontSize={18} /></div>
            <div className={style.sku}>{inStock ? '辽宁辽工智能装备制造有限公司' : '高东阳（生产制造部-操作工）'}</div>
            <DownOutline onClick={() => setShowId(show ? '' : item)} />
          </div>
          <div hidden={!show}>
            {
              [1, 2, 3].map((item, index) => {
                return <div key={index}>
                  <div className={style.skuItem} style={{ paddingTop: index === 0 && 0 }}>
                    <SkuItem
                      extraWidth='140px'
                      title='黑色内扣冷却管'
                      describe='lqg-700/ 1/2*700mm黑色内螺纹'
                      className={style.sku}
                    />
                    <div>
                      <div hidden={!inStock} className={style.action}>已入库</div>
                      × 1000
                    </div>
                  </div>
                  <ShowBrand brands={[1, 2]} hidden={!isArray(searchParams.show).includes('brand')} />
                  <div className={style.skuSpace} />
                </div>;
              })
            }
          </div>
        </div>;
      });
    }
    return [1, 2, 3].map((item, index) => {
      let other = '';
      if (inStock) {
        switch (searchParams.dimension) {
          case 'sku':
            other = <Space>
              <div>到货 ×1000</div>
              <div>终止入库 <span className='red'>×5000</span></div>
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
      return <div key={index} className={style.skuList}>
        <div className={style.skuItem}>
          <div className={style.check}><MyCheck fontSize={18} /></div>
          <SkuItem
            extraWidth='170px'
            title='黑色内扣冷却管'
            describe='lqg-700/ 1/2*700mm黑色内螺纹'
            className={style.sku}
            otherData={[other]}
          />
          <div>
            <div hidden={!inStock} className={style.action}>已入库</div>
            × 1000
          </div>
        </div>
        <ShowSupply
          supplys={[1, 2]}
          hidden={!isArray(searchParams.show).includes('supply')}
          searchParams={searchParams}
        />
        <ShowBrand
          brands={[1, 2]}
          hidden={!isArray(searchParams.show).includes('brand') || isArray(searchParams.show).includes('supply')}
        />
        <ShowUser
          hidden={!isArray(searchParams.show).includes('userId')}
          users={[1, 2]}
        />
        <div className={style.skuSpace} />
      </div>;
    });
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
      options={[
        { label: '近7天', value: '近7天' },
        { label: '近30天', value: '近30天' },
        { label: '近三月', value: '近三月' },
        { label: '近半年', value: '近半年' },
        { label: '近一年', value: '近一年' },
        { label: '至今', value: '至今' },
        { label: '自定义', value: 'diy' },
      ]}
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
      dataRef={dataRef}
    />

    {(exportLoading || viewtLoading) && <MyLoading />}

  </>;
};

export default DataChar;
