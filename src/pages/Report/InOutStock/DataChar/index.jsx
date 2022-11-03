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

export const InStockDataList = { url: '/statisticalView/instockView', method: 'POST' };
export const InStockExport = { url: '/viewExcel/export', method: 'POST' };
export const InStockViewTotail = { url: '/statisticalView/viewTotail', method: 'POST' };

const DataChar = (
  {
    skuClass,
    searchParams = {},
    setSearchParams = () => {
    },
    openSearch = () => {
    },
    date = [],
  },
) => {

  const history = useHistory();

  const listRef = useRef();

  const [list, setList] = useState([]);

  const [search, setSearch] = useState('');

  const [searchValue, setSearchValue] = useState('');

  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const [screenKey, setScreenkey] = useState();

  const [visible, setVisible] = useState('');

  const screens = [
    { title: '状态', key: 'status' },
    { title: '物料分类', key: 'skuClass' },
    { title: '更多', key: 'all' },
  ];

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

  return <>
    <div className={style.dimension}>
      <Button
        className={style.detail}
        color={searchParams.dimension === 'detail' ? 'primary' : 'default'}
        onClick={() => setSearchParams({ ...searchParams, dimension: 'detail', show: ['sku'] })}
      >明细</Button>
      <Button
        className={style.sku}
        color={searchParams.dimension === 'sku' ? 'primary' : 'default'}
        onClick={() => setSearchParams({ ...searchParams, dimension: 'sku', show: ['sku'] })}
      >物料</Button>
      <Button
        className={style.supply}
        color={searchParams.dimension === 'supply' ? 'primary' : 'default'}
        onClick={() => setSearchParams({ ...searchParams, dimension: 'supply', show: ['sku'] })}
      >供应商</Button>
    </div>

    <div className={style.listSearch}>
      <MySearch
        value={searchValue}
        className={style.searchBar}
        placeholder='搜索'
        style={{ padding: '8px 12px' }}
        onChange={setSearchValue}
        onSearch={(value) => {
          listRef.current.submit({ beginTime: date[0], endTime: date[1], customerName: value });
        }}
      />
      <div className={drowStyle.dropDown} style={{gap:8}}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'skuClass':
                title = searchParams.skuClassName;
                break;
              case 'status':
                title = searchParams.statusName;
                break;
              default:
                break;
            }
            const check = title || screenKey === item.key;
            return <div
              className={classNames(drowStyle.titleBox, check && drowStyle.checked)}
              key={item.key}
              onClick={() => {
                switch (item.key) {
                  case 'skuClass':
                  case 'status':
                    setVisible(item.key);
                    break;
                  default:
                    openSearch();
                    break;
                }
                setScreenkey(item.key);
              }}>
              <div className={drowStyle.title}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
    </div>

    {
      [1, 2, 3].map((item, index) => {
        return <div key={index}>
          <div className={style.skuItem}>
            <div className={style.check}><MyCheck fontSize={18} /></div>
            <SkuItem className={style.sku} />
            <div>
              <div className={style.action}>已入库</div>
              × 1000
            </div>
          </div>
          <div className={style.skuSpace} />
        </div>;
      })
    }

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

    {(exportLoading || viewtLoading) && <MyLoading />}

    <MyAntPopup
      title='选择状态'
      visible={visible === 'status'}
      onClose={() => setVisible('')}
    >
      <div style={{ padding: 12 }}>
        <Selector
          columns={3}
          style={SelectorStyle}
          value={searchParams.status}
          showCheckMark={false}
          multiple
          options={[
            { label: '已到货', value: 'arrival' },
            { label: '已入库', value: 'in' },
            { label: '终止入库', value: 'stop' },
            { label: '已出库', value: 'out' },
          ]}
          onChange={(v, { items }) => {
            setSearchParams({ ...searchParams, status: v, statusName: items.map(item => item.label).join(',') });
          }}
        />
      </div>
    </MyAntPopup>

    <MyAntPopup
      title='选择分类'
      visible={visible === 'skuClass'}
      onClose={() => {
        setScreenkey('');
        setVisible('');
      }}
    >
      <div style={{ padding: 12 }}>
        <Selector
          columns={3}
          className={style.selector}
          style={SelectorStyle}
          value={searchParams.skuClass}
          showCheckMark={false}
          multiple
          options={isArray(skuClass)}
          onChange={(v, { items }) => {
            setSearchParams({ ...searchParams, skuClass: v , skuClassName: items.map(item => item.label).join(',') });
          }}
        />
      </div>
    </MyAntPopup>


  </>;
};

export default DataChar;
