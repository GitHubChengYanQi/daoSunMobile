import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import style from '../ProcessTask/index.less';
import { classNames } from '../../components/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import styles from './index.less';
import SkuClass from '../ProcessTask/MyAudit/components/SkuClass';
import MyPicker from '../../components/MyPicker';
import MyList from '../../components/MyList';
import MyCheck from '../../components/MyCheck';
import CheckAllExport from '../../components/CheckAllExport';
import SkuItem from '../Sku/SkuItem';
import LinkButton from '../../components/LinkButton';

const warningSku = { url: '/stockForewarn/warningSku', method: 'POST' };

const StockForewarn = () => {

  const listRef = useRef();

  const screens = [
    { key: 'skuClass', title: '物料分类' },
    { key: 'status', title: '预警状态' },
    { key: 'purchaseStatus', title: '采购状态' },
  ];

  const [screen, setScreen] = useState({});
  const [screenKey, setScreenkey] = useState();
  const [params, setParams] = useState({});
  const [list, setList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);


  const submit = (data = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    listRef.current?.submit(newParmas);
  };

  return <>
    <MyNavBar title='库存预警' />
    <MySearch />
    <div className={styles.dropDown}>
      <div className={style.dropDown}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'skuClass':
                title = screen.skuClassName;
                break;
              case 'status':
                title = screen.status;
                break;
              case 'purchaseStatus':
                title = screen.purchaseStatus;
                break;
            }
            const check = title || screenKey === item.key;
            return <div className={classNames(style.titleBox, check && style.checked)} key={item.key} onClick={() => {
              setScreenkey(item.key);
            }}>
              <div className={style.title}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
    </div>

    <MyList
      api={warningSku}
      getData={setList}
      data={list}
      ref={listRef}
    >
      {
        list.map((item, index) => {
          return <div key={index} className={styles.skuItem}>
            <MyCheck fontSize={17} />
            <SkuItem
              skuResult={item.skuResult}
              className={styles.sku}
              extraWidth='110px'
              otherData={[
                <div style={{ color: '#9A9A9A' }}>库存下限：100&nbsp;&nbsp;库存上限：200</div>,
              ]}
            />
            <div className={styles.action}>
              <div>已采购</div>
              <LinkButton onClick={() => setVisible(true)}>来源明细</LinkButton>
            </div>
          </div>;
        })
      }
    </MyList>

    <CheckAllExport
      onCheckAll={setCheckAll}
      pageAll={currentAll}
      onPageAll={setCurrentAll}
      checkAll={checkAll}
    />

    <SkuClass
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.skuClassId ? [{ value: params.skuClassId, label: screen.skuClassName }] : []}
      visible={screenKey === 'skuClass'}
      onChange={(skuClass) => {
        submit({ skuClassId: skuClass?.value });
        setScreen({ ...screen, skuClassName: skuClass?.label });
        setScreenkey('');
      }}
    />

    <MyPicker
      visible={screenKey === 'status'}
      value={params.status}
      onChange={(option) => {
        submit({ status: option.value });
        setScreen({ ...screen, status: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '全部', value: '全部' },
        { label: '下限预警', value: '下限预警' },
        { label: '上限预警', value: '上限预警' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'purchaseStatus'}
      value={params.purchaseStatus}
      onChange={(option) => {
        submit({ purchaseStatus: option.value });
        setScreen({ ...screen, purchaseStatus: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '全部', value: '全部' },
        { label: '未采购', value: '未采购' },
        { label: '已采购', value: '已采购' },
      ]}
      onClose={() => setScreenkey('')}
    />
  </>;
};

export default StockForewarn;
