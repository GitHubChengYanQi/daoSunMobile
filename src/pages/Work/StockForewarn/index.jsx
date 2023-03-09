import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import style from '../ProcessTask/index.less';
import { classNames } from '../../../util/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import styles from './index.less';
import SkuClass from '../ProcessTask/MyAudit/components/SkuClass';
import MyPicker from '../../components/MyPicker';
import MyList from '../../components/MyList';
import MyCheck from '../../components/MyCheck';
import CheckAllExport from '../../components/CheckAllExport';
import SkuItem from '../Sku/SkuItem';
import LinkButton from '../../components/LinkButton';
import MyAntPopup from '../../components/MyAntPopup';
import Reserve from './components/Reserve';
import { Message } from '../../components/Message';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';

const warningSku = { url: '/stockForewarn/warningSku', method: 'POST' };
export const purchaseListListBySkuId = { url: '/purchaseList/listBySkuId', method: 'GET' };

const StockForewarn = () => {

  const listRef = useRef();

  const [reserveOpen, setReserveOpen] = useState(false);

  const screens = [
    { key: 'skuClass', title: '物料分类' },
    { key: 'forewarnStatus', title: '预警状态' },
    // { key: 'purchaseStatus', title: '采购状态' },
  ];

  const [screen, setScreen] = useState({});
  const [screenKey, setScreenkey] = useState();
  const [params, setParams] = useState({});
  const [list, setList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const [ids, setIds] = useState([]);

  const [searchValue, setSearchValue] = useState('');


  const submit = (data = {}) => {
    const newParmas = { ...params, ...data };
    setParams(newParmas);
    listRef.current?.submit(newParmas);
  };

  const {
    loading: purchaseListListLoading,
    data: purchaseListList = [],
    run: getPurchaseList,
  } = useRequest(purchaseListListBySkuId, { manual: true });

  return <div style={{ height: 'calc(100% - 53px)', overflow: 'auto' }}>
    <MyNavBar title='库存预警' />
    <MySearch value={searchValue} onChange={setSearchValue} onSearch={(keyWords) => {
      submit({ keyWords });
    }} />
    <div className={styles.dropDown}>
      <div className={style.dropDown}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'skuClass':
                title = screen.skuClassName;
                break;
              case 'forewarnStatus':
                title = screen.forewarnStatus;
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
          const checked = ids.find(id => item.skuId === id);
          return <div
            key={index}
            className={styles.skuItem}
            onClick={() => {
              setIds(checked ? ids.filter(id => id !== item.skuId) : [...ids, item.skuId]);
            }}
          >
            <div hidden>
              <MyCheck fontSize={17} checked={checked} />
            </div>

            <SkuItem
              noView
              skuResult={item.skuResult}
              className={styles.sku}
              extraWidth='110px'
              otherData={[
                <div style={{ color: '#00a200' }}>
                  <span>
                    在途数量：{item.floatingCargoNumber}
                  </span>
                  &nbsp;&nbsp;
                  <span>
                    待采数量：{item.purchaseNumber || 0}
                  </span>
                </div>,
                <div style={{ color: '#9A9A9A' }}>
                  <span
                    hidden={!item.inventoryFloor}
                    className={item.number <= item.inventoryFloor ? 'red' : ''}>库存下限：{item.inventoryFloor}</span>&nbsp;&nbsp;
                  <span
                    hidden={!item.inventoryCeiling}
                    className={item.number >= item.inventoryCeiling ? 'red' : ''}>库存上限：{item.inventoryCeiling}</span>
                </div>,
              ]}
            />
            <div className={styles.action}>
              <div hidden>已采购</div>
              <LinkButton onClick={async () => {
                await getPurchaseList({
                  params: {
                    skuId: item.skuId,
                  },
                });
                setReserveOpen(item);
              }}>备采</LinkButton>
            </div>
          </div>;
        })
      }
    </MyList>

    <div hidden>
      <CheckAllExport
        onCheckAll={() => {
          setIds(list.map(item => item.skuId));
          setCheckAll(true);
          setCurrentAll(false);
        }}
        pageAll={currentAll && list.length === ids.length}
        onPageAll={() => {
          setIds(list.map(item => item.skuId));
          setCheckAll(false);
          setCurrentAll(true);
        }}
        checkAll={checkAll && list.length === ids.length}
      />
    </div>

    <MyAntPopup visible={reserveOpen} title='添加预购物料' onClose={() => setReserveOpen(null)}>
      <Reserve
        purchaseListList={purchaseListList}
        sku={reserveOpen || {}}
        onClose={() => {
          setReserveOpen(null);
        }}
        onSuccess={() => {
          Message.toast('添加成功！');
          setReserveOpen(null);
          listRef.current.submit()
        }} />
    </MyAntPopup>


    <SkuClass
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.classId ? [{ value: params.classId, label: screen.skuClassName }] : []}
      visible={screenKey === 'skuClass'}
      onChange={(skuClass) => {
        submit({ classId: skuClass?.value });
        setScreen({ ...screen, skuClassName: skuClass?.label });
        setScreenkey('');
      }}
    />

    <MyPicker
      visible={screenKey === 'forewarnStatus'}
      value={params.forewarnStatus}
      onChange={(option) => {
        submit({ forewarnStatus: option.value });
        setScreen({ ...screen, forewarnStatus: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '全部', value: 'all' },
        { label: '下限预警', value: 'min' },
        { label: '上限预警', value: 'max' },
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

    {purchaseListListLoading && <MyLoading />}
  </div>;
};

export default StockForewarn;
