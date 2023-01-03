import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MySearch from '../../components/MySearch';
import style from '../../Work/ProcessTask/index.less';
import styles from './index.less';
import { Button, Space, Tabs } from 'antd-mobile';
import moment from 'moment';
import { classNames, isObject } from '../../../util/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyNavBar from '../../components/MyNavBar';
import StartEndDate from '../../components/StartEndDate';
import CheckUser from '../../components/CheckUser';
import SkuClass from '../../Work/ProcessTask/MyAudit/components/SkuClass';
import MyRadio from '../../components/MyRadio';
import OutAsk from './components/OutAsk';
import Customers from '../../Work/ProcessTask/MyAudit/components/Customers';
import MyActionSheet from '../../components/MyActionSheet';
import InAsk from './components/InAsk';
import MyPicker from '../../components/MyPicker';
import InStockWorkDetail from './components/InStockWorkDetail';
import MyEmpty from '../../components/MyEmpty';
import InStockSummary from './components/InStockSummary';
import InStockNumber from './components/InStockNumber';
import { InType } from '../../Work/CreateTask/components/InstockAsk';
import { OutType } from '../../Work/CreateTask/components/OutstockAsk';
import OutStockUseNumber from './components/OutStockUseNumber';
import InStockArrival from './components/InStockArrival';
import OutStockSummary from './components/OutStockSummary';
import OutStockNumber from './components/OutStockNumber';
import OutStockWorkDetail from './components/OutStockWorkDetail';
import ErrorSkus from './components/ErrorSkus';
import SkuStock from './components/SkuStock';
import StockCycle from './components/StockCycle';
import LackSkus from './components/LackSkus';
import ExecuteNumber from './components/ExecuteNumber';
import MyCheckList from '../../components/MyCheckList';
import { storeHouseSelect } from '../../Work/Quality/Url';
import { materialListSelect } from '../../Work/Sku/Edit';
import ReceiptDetails from './components/ReceiptDetails';
import CheckAllExport from '../../components/CheckAllExport';
import CountTimesDetails from './components/CountTimesDetails';
import ExceptionDetails from './components/ExceptionDetails';
import InventoryRequisition from './components/InventoryRequisition';

const ReportDetail = () => {

  const { query = {} } = useLocation();

  const userRef = useRef();
  const createUserRef = useRef();
  const dataRef = useRef();

  const listRef = useRef();

  const [params, setParams] = useState({});

  const [exportVisible, setExportVisible] = useState(false);

  const [key, setKey] = useState();

  const [screenKey, setScreenkey] = useState();

  const [checkAll, setCheckAll] = useState(false);
  const [currentAll, setCurrentAll] = useState(false);

  const submit = (data = {}, reset) => {
    const newParmas = reset ? { ...defaultParams, ...data } : { ...params, ...data };
    if (reset) {
      setScreen({});
    }
    setParams(newParmas);
    listRef.current?.submit(newParmas);
  };

  let title = '';
  let tabs = [];
  let Content;
  let contentProps = {};
  let defaultScreen = {};
  let defaultParams = {};

  switch (query.type) {

    // 入库
    case 'inAskNumber':
      title = '入库申请排行';
      tabs = [
        {
          title: '申请次数',
          key: 'ORDER_BY_CREATE_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '供应商', key: 'customerId' },
            { title: '任务类型', key: 'inStockType' },
          ],
        },
        {
          title: '物料数量',
          key: 'ORDER_BY_DETAIL',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'inStockType' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = InAsk;
      break;
    case 'receiptDetails':
      title = '收货明细';
      tabs = [
        {
          title: '收货明细',
          key: 'ReceiptDetails',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '类型', key: 'receiptType' },
            { title: '供应商', key: 'customerId' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
      ];
      defaultScreen = { receiptType: query.receiptTypeName };
      defaultParams = { searchType: query.receiptType };
      Content = ReceiptDetails;
      break;
    case 'inStockWork':
      title = '入库工作明细';
      tabs = [
        {
          title: '次数',
          key: 'ORDER_LOG',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '数量排行', key: 'numberRanking' },
          ],
        },
      ];
      defaultScreen = { numberRanking: '次数排行' };
      Content = InStockWorkDetail;
      break;
    case 'inStockArrival':
      title = '供应明细';
      tabs = [
        {
          title: '入库类数',
          key: 'SKU_COUNT',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '入库件数', key: 'inStockRanking' },
          ],
        },
      ];
      defaultParams = { searchType: 'SKU_COUNT' };
      defaultScreen = { inStockRanking: '入库类数' };
      Content = InStockArrival;
      break;
    case 'inStockSummary':
      title = '入库汇总';
      tabs = [
        {
          title: '入库类数',
          key: 'SKU_COUNT',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'inStockType' },
          ],
        },
      ];
      Content = InStockSummary;
      break;
    case 'inStockNumber':
      title = '物料入库排行';
      tabs = [
        {
          title: '物料分类',
          key: 'SPU_CLASS',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '任务类型', key: 'inStockType' },
            { title: '仓库', key: 'storehouseId' },
          ],
        }, {
          title: '任务类型',
          key: 'TYPE',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '仓库', key: 'storehouseId' },
          ],
        }, {
          title: '入库仓库',
          key: 'STOREHOUSE',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'inStockRanking' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = InStockNumber;
      break;

    // 出库
    case 'outAskNumber':
      title = '出库申请排行';
      tabs = [
        {
          title: '任务次数',
          key: 'ORDER_BY_CREATE_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '领料人', key: 'pickUserId' },
          ],
        },
        {
          title: '物料数量',
          key: 'ORDER_BY_DETAIL',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = OutAsk;
      break;
    case 'outStockSummary':
      title = '出库汇总';
      tabs = [
        {
          title: '入库类数',
          key: 'SKU_COUNT',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassIds' },
            { title: '任务类型', key: 'outStockType' },
          ],
        },
      ];
      Content = OutStockSummary;
      break;
    case 'useNumber':
      title = '出库用料明细';
      tabs = [
        {
          title: '出库类数',
          key: 'SKU_COUNT',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'outStockType' },
          ],
        },
      ];
      Content = OutStockUseNumber;
      break;
    case 'outStockNumber':
      title = '物料出库排行';
      tabs = [
        {
          title: '物料分类',
          key: 'SPU_CLASS',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '任务类型', key: 'outStockType' },
            { title: '仓库', key: 'storehouseId' },
            { title: '领料人', key: 'userId' },
          ],
        }, {
          title: '任务类型',
          key: 'TYPE',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '仓库', key: 'storehouseId' },
            { title: '领料人', key: 'userId' },
          ],
        }, {
          title: '出库仓库',
          key: 'STOREHOUSE',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'outStockType' },
            { title: '领料人', key: 'userId' },
          ],
        }, {
          title: '领料人员',
          key: 'PICK_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '任务类型', key: 'outStockType' },
            { title: '仓库', key: 'storehouseId' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = OutStockNumber;
      break;
    case 'outStockWork':
      title = '出库工作明细';
      tabs = [
        {
          title: '次数',
          key: 'ORDER_LOG',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '数量排行', key: 'numberRanking' },
          ],
        },
      ];
      defaultScreen = { numberRanking: '次数排行' };
      Content = OutStockWorkDetail;
      break;

    //  盘点
    case 'CountTimesDetails':
      title = '盘点次数明细'
      tabs = [
        {
          title: '物料',
          key: 'SPU_CLASS',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
        {
          title: '人员',
          key: 'PICK_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
        ]
      defaultParams = { searchType: tabs[0]?.key };
      Content = CountTimesDetails;
      break;
    case 'exceptionDetails':
      title = '异常明细'
      tabs = [
        {
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
      ]
      Content = ExceptionDetails;
      break;
    case 'rankingOfInventory':
      title = '盘点申请排行'
      tabs = [
        {
          title: '任务次数',
          key: 'SPU_CLASS',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '状态', key: 'stockStatus' },
            { title: '执行人', key: 'spuClassId' },
          ],
        },
        {
          title: '物料数量',
          key: 'PICK_USER',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
      ]
      Content = InventoryRequisition

    ;
      break;

    // 综合
    case 'errorSkus':
      title = '异常物料明细';
      tabs = [
        {
          title: '异常物料明细',
          key: 'SPU_CLASS',
          screens: [
            { title: '物料分类', key: 'spuClassId' },
            { title: '仓库', key: 'storehouseId' },
          ],
        },
      ];
      Content = ErrorSkus;
      break;
    case 'stockRanking':
      title = '物料库存排行';
      tabs = [
        {
          title: '物料分类',
          key: 'SPU_CLASS',
          screens: [
            { title: '状态', key: 'stockStatus' },
            { title: '仓库', key: 'storehouseId' },
            { title: '材质', key: 'material' },
            { title: '供应商', key: 'customerId' },
          ],
        }, {
          title: '仓库排行',
          key: 'STOREHOUSE',
          screens: [
            { title: '状态', key: 'stockStatus' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '材质', key: 'material' },
            { title: '供应商', key: 'customerId' },
          ],
        }, {
          title: '材质排行',
          key: 'MATERIAL',
          screens: [
            { title: '状态', key: 'stockStatus' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '仓库', key: 'storehouseId' },
            { title: '供应商', key: 'customerId' },
          ],
        }, {
          title: '供应商排行',
          key: 'CUSTOMER',
          screens: [
            { title: '状态', key: 'inStockStatus' },
            { title: '物料分类', key: 'spuClassId' },
            { title: '仓库', key: 'storehouseId' },
            { title: '材质', key: 'material' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = SkuStock;
      break;
    case 'stockCycle':
      title = '库存周期明细';
      tabs = [
        {
          title: '库存周期明细',
          key: 'SPU_CLASS',
          screens: [
            { title: '物料分类', key: 'spuClassId' },
            { title: '材质', key: 'material' },
            { title: '仓库', key: 'storehouseId' },
          ],
        },
      ];
      Content = StockCycle;
      break;
    case 'lackSkus':
      title = '缺欠明细';
      tabs = [
        {
          title: '累计缺欠次数',
          key: 'SPU_CLASS',
          screens: [
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
        {
          title: '实时缺欠数量',
          key: 'now',
          screens: [
            { title: '物料分类', key: 'spuClassId' },
            { title: '供应商', key: 'customerId' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = LackSkus;
      break;
    case 'executeNumber':
      title = '执行数量排行';
      tabs = [
        {
          title: '申请数量',
          key: 'ask',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '类型', key: 'type' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
        {
          title: '执行数量',
          key: 'execute',
          screens: [
            { title: '日期', key: 'createTime' },
            { title: '类型', key: 'type' },
            { title: '物料分类', key: 'spuClassId' },
          ],
        },
      ];
      defaultParams = { searchType: tabs[0]?.key };
      Content = ExecuteNumber;
      break;

    default:
      Content = MyEmpty;
      break;
  }

  const [screens, setScreens] = useState(tabs[0]?.screens || []);

  const [screen, setScreen] = useState(defaultScreen);

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    submit(defaultParams);
  }, []);

  if (!query.type) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title={title} />
    <MySearch placeholder='搜索' onChange={setSearchValue} value={searchValue} onSearch={(name) => {
      submit({ name });
    }} />
    <div className={style.space} />
    <div hidden={tabs.length <= 1} className={styles.tabs}>
      <Tabs
        onChange={(key) => {
          const tabItem = tabs.find(item => item.key === key);
          setScreens(tabItem.screens);
          setKey(key);
          submit({ searchType: key }, true);
        }}
        activeKey={key}
      >
        {
          tabs.map(item => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <div
      style={{ borderBottom: '1px solid var(--body--background--color)' }}
      className={style.screent}
    >
      <div className={style.dropDown} style={{ padding: '10px 8px', gap: 8 }}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'pickUserId':
                title = screen.userName;
                break;
              case 'createTime':
                title = params.beginTime ? moment(params.beginTime).format('MM/DD') + '-' + moment(params.endTime).format('MM/DD') : '';
                break;
              case 'customerId':
                title = screen.customerName;
                break;
              case 'spuClassId':
                title = screen.skuClassName;
                break;
              case 'numberRanking':
                title = screen.numberRanking;
                break;
              case 'inStockStatus':
                title = screen.inStockStatus;
                break;
              case 'inStockRanking':
                title = screen.inStockRanking;
                break;
              case 'outStockRanking':
                title = screen.outStockRanking;
                break;
              case 'inStockType':
                title = screen.inStockType;
                break;
              case 'outStockType':
                title = screen.type;
                break;
              case 'storehouseId':
                title = screen.storehouseName;
                break;
              case 'material':
                title = screen.materialName;
                break;
              case 'stockStatus':
                title = screen.stockStatus;
                break;
              case 'receiptType':
                title = screen.receiptType;
                break;
            }
            const check = title || screenKey === item.key;
            return <div
              style={{ width: `${parseInt(100 / screens.length)}%` }}
              className={classNames(style.titleBox, check && style.checked)}
              key={item.key}
              onClick={() => {
                switch (item.key) {
                  case 'createUser':
                    createUserRef.current.open();
                    break;
                  case 'pickUserId':
                    userRef.current.open();
                    break;
                  case 'createTime':
                    dataRef.current.open();
                    break;
                  default:
                    break;
                }
                setScreenkey(item.key);
              }}>
              <div className={style.title} style={{ minWidth: '80%', textAlign: 'center' }}>{title || item.title}</div>
              {screenKey === item.key ? <UpOutline /> : <DownOutline />}
            </div>;
          })
        }
      </div>
    </div>

    <Content listRef={listRef} params={params} {...contentProps} />

    <CheckAllExport
      onCheckAll={setCheckAll}
      pageAll={currentAll}
      onPageAll={setCurrentAll}
      checkAll={checkAll}
      onExport={()=> setExportVisible(true)}
    />

    <StartEndDate
      render
      onClose={() => setScreenkey('')}
      precision='day'
      minWidth='100%'
      textAlign='left'
      value={params.beginTime ? [params.beginTime, params.endTime] : []}
      max={new Date()}
      onChange={(creatTime) => {
        submit({ beginTime: creatTime[0], endTime: creatTime[1] });
        setScreenkey('');
      }}
      dataRef={dataRef}
    />

    <CheckUser
      zIndex={1002}
      ref={userRef}
      onClose={() => setScreenkey('')}
      value={params.pickUserId ? [{ id: params.pickUserId }] : []}
      onChange={(users) => {
        submit({ pickUserId: isObject(users[0]).id });
        setScreen({ ...screen, userName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <SkuClass
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.spuClassId ? [{ value: params.spuClassId, label: screen.skuClassName }] : []}
      visible={screenKey === 'spuClassId'}
      onChange={(skuClass) => {
        submit({ spuClassId: skuClass?.value });
        setScreen({ ...screen, skuClassName: skuClass?.label });
        setScreenkey('');
      }}
    />

    <Customers
      onClose={() => setScreenkey('')}
      zIndex={1002}
      value={params.customerId ? [{ customerId: params.customerId, customerName: screen.customerName }] : []}
      visible={screenKey === 'customerId'}
      onChange={(customer) => {
        submit({ customerId: customer?.customerId });
        setScreen({ ...screen, customerName: customer?.customerName });
        setScreenkey('');
      }}
    />

    <MyCheckList
      noSearch
      noPage
      searchPlaceholder='请输入仓库信息'
      api={storeHouseSelect}
      label='label'
      listKey='value'
      onClose={() => setScreenkey('')}
      onChange={(store) => {
        submit({ storehouseId: store?.value });
        setScreen({ ...screen, storehouseName: store?.label });
        setScreenkey('');
      }}
      value={params.storehouseId ? [{ value: params.storehouseId, label: screen.storehouseName }] : []}
      visible={screenKey === 'storehouseId'}
      title='选择仓库'
    />

    <MyCheckList
      noSearch
      noPage
      searchPlaceholder='请输入材质信息'
      api={materialListSelect}
      label='label'
      listKey='value'
      onClose={() => setScreenkey('')}
      onChange={(store) => {
        submit({ materialId: store?.value });
        setScreen({ ...screen, materialName: store?.label });
        setScreenkey('');
      }}
      value={params.materialId ? [{ value: params.materialId, label: screen.materialName }] : []}
      visible={screenKey === 'material'}
      title='选择材质'
    />

    <MyPicker
      visible={screenKey === 'numberRanking'}
      value={params.searchType}
      onChange={(option) => {
        submit({ searchType: option.value });
        setScreen({ ...screen, numberRanking: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '次数排行', value: 'ORDER_LOG' },
        { label: '数量排行', value: 'ORDER_LOG_DETAIL' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'inStockRanking'}
      value={params.searchType}
      onChange={(option) => {
        submit({ searchType: option.value });
        setScreen({ ...screen, inStockRanking: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '入库类数', value: 'SKU_COUNT' },
        { label: '入库件数', value: 'NUM_COUNT' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'receiptType'}
      value={params.searchType}
      onChange={(option) => {
        submit({ searchType: option.value });
        setScreen({ ...screen, receiptType: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '收货', value: 'INSTOCK_LIST' },
        { label: '已入库', value: 'INSTOCK_NUMBER' },
        { label: '未入库', value: 'NO_INSTOCK_NUMBER' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'inStockType'}
      value={params.inStockType}
      onChange={(option) => {
        submit({ inStockType: option.value });
        setScreen({ ...screen, inStockType: option.label });
        setScreenkey('');
      }}
      options={[{ label: '全部', value: 'all' }, ...InType]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'outStockType'}
      value={params.type}
      onChange={(option) => {
        if (option.value === 'all') {
          submit({ type: null });
        } else {
          submit({ type: option.value });
        }
        setScreen({ ...screen, type: option.label });
        setScreenkey('');
      }}
      options={[{ label: '全部', value: 'all' }, ...OutType]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'inStockStatus'}
      value={params.inStockStatus}
      onChange={(option) => {
        submit({ inStockStatus: option.value });
        setScreen({ ...screen, inStockStatus: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '全部', value: '全部' },
        { label: '送货', value: '送货' },
        { label: '已入库', value: '已入库' },
        { label: '拒绝入库', value: '拒绝入库' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyPicker
      visible={screenKey === 'stockStatus'}
      value={params.stockStatus}
      onChange={(option) => {
        submit({ stockStatus: option.value });
        setScreen({ ...screen, stockStatus: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '全部', value: '全部' },
        { label: '正常', value: '正常' },
        { label: '异常', value: '异常' },
      ]}
      onClose={() => setScreenkey('')}
    />


    <MyActionSheet
      visible={exportVisible}
      actions={[{ key: 'excel', text: '导出Excel' }, { key: 'pdf', text: '导出PDF' }]}
      onAction={(action) => {

      }}
      onClose={() => setExportVisible(false)}
    />
  </>;
};

export default ReportDetail;
