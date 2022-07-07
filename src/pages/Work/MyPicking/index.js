import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import Icon from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import { Button, Tabs } from 'antd-mobile';
import topStyle from '../../global.less';
import { ToolUtil } from '../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import Receipts from './components/Receipts';
import MyCheck from '../../components/MyCheck';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import { Message } from '../../components/Message';
import Sku from './components/Sku';

const outStockByReceipts = { url: '/productionPickLists/createOutStockOrder', method: 'POST' };
const outStockBySku = { url: '/productionPickLists/createOutStockOrderBySku', method: 'POST' };

const MyPicking = () => {

  const [key, setKey] = useState('receipts');

  const [searchValue, setSearchValue] = useState();

  const ref = useRef();

  const [screen, { setFalse, setTrue }] = useBoolean();

  const [count, setCount] = useState(0);

  const [outSkus, setOutSkus] = useState([]);

  const [refresh, setRefresh] = useState();

  const { loading: receiptsLoading, run: receiptsRun } = useRequest(outStockByReceipts, {
    manual: true,
    onSuccess: () => {
      Message.successToast('领取成功！', () => {
        setRefresh(true);
      });
    },
    onError: () => {
      Message.errorToast('领取失败！');
    },
  });

  const { loading: skuLoading, run: skuRun } = useRequest(outStockBySku, {
    manual: true,
    onSuccess: () => {
      Message.successToast('领取成功！',()=>{
        setRefresh(true);
      });
    },
    onError: () => {
      Message.errorToast('领取失败！');
    },
  });

  const [allChecked, setAllChecked] = useState();

  const tabs = [
    { title: '单据', key: 'receipts' },
    { title: '物料', key: 'sku' },
  ];

  const content = () => {
    switch (key) {
      case 'receipts':
        return <Receipts
          value={outSkus}
          getCount={(number) => {
            setRefresh(false);
            setCount(number);
          }}
          onChange={(array) => {
            setAllChecked(count ? array.length === count : false);
            setOutSkus(array);
          }}
          allChecked={allChecked}
          refresh={refresh}
        />;
      case 'sku':
        return <Sku
          value={outSkus}
          getCount={(number) => {
            setRefresh(false);
            setCount(number);
          }}
          onChange={(array) => {
            setAllChecked(count ? array.length === count : false);
            setOutSkus(array);
          }}
          allChecked={allChecked}
          refresh={refresh}
        />;
      default:
        return <MyEmpty />;
    }
  };

  return <div className={style.myPicking}>
    <MyNavBar title='领料中心' />
    <div className={style.content} style={{ backgroundColor: key === 'sku' && '#fff' }}>
      <MySearch
        searchIcon={<><Icon type='icon-dibudaohang-saoma' /> | </>} placeholder='搜索'
        value={searchValue}
        onChange={setSearchValue}
        onSearch={(value) => {
          if (!ref.current) {
            return;
          }
          ref.current.submit({ skuName: value });
        }}
        onClear={() => {
          ref.current.submit({ skuName: '' });
        }}
      />
      <Tabs
        activeKey={key}
        onChange={key => {
          setSearchValue('');
          setKey(key);
        }}
        className={style.tab}
      >
        {
          tabs.map((item) => {
            return <Tabs.Tab
              className={key === item.key ? style.checkTabItem : style.tabItem}
              {...item}
            />;
          })
        }
      </Tabs>
      <div className={topStyle.top}>
        <div
          className={topStyle.screen}
          style={{ borderBottom: '1px solid #E1EBF6' }}
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
          <div className={topStyle.stockNumber}>可领数量：<span>{count}</span>类</div>
          <div
            className={ToolUtil.classNames(topStyle.screenButton, screen ? topStyle.checked : '')}
          >
            筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
          </div>
        </div>
      </div>
      {content()}
    </div>
    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck disabled={count === 0} checked={allChecked} onChange={() => {
          if (allChecked) {
            setOutSkus([]);
            setAllChecked(false);
          } else {
            setAllChecked(true);
          }
        }}>{allChecked ? '取消全选' : '全选'}</MyCheck> <span>已选中 {outSkus.length} 类</span>
      </div>
      <div className={style.buttons}>
        <Button
          disabled={outSkus.length === 0}
          color='primary'
          onClick={() => {
            const cartsParams = [];
            switch (key) {
              case 'receipts':
                outSkus.map(item => {
                  return cartsParams.push({
                    pickListsId: item.pickListsId,
                    skuId: item.skuId,
                    number: item.perpareNumber,
                    brandIds: item.brandIds,
                  });
                });
                receiptsRun({
                  data: {
                    cartsParams,
                  },
                });
                return;
              case 'sku':
                outSkus.map(skuItem => {
                  const cartResults = skuItem.cartResults || [];
                  return cartResults.map(item => {
                    return cartsParams.push({
                      'storehouseId': skuItem.storehouseId,
                      'skuId': skuItem.skuId,
                      'pickListsId': item.pickListsId,
                      'number': item.number,
                    });
                  });
                });
                skuRun({
                  data: {
                    cartsParams,
                  },
                });
                return;
              default:
                return;
            }
          }}
        >确认</Button>
      </div>
    </div>

    {(skuLoading || receiptsLoading) && <MyLoading />}
  </div>;

};

export default MyPicking;
