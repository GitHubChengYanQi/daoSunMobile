import React, { useRef, useState } from 'react';
import { Tag } from 'antd-mobile';
import styles from './index.less';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import MySearch from '../../components/MySearch';
import { useHistory } from 'react-router-dom';
import BottomButton from '../../components/BottomButton';
import MyProgress from '@/pages/components/MyProgress';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { MyDate } from '../../components/MyDate';
import style from '../ProcessTask/index.less';
import moment from 'moment';
import { classNames, isArray, isObject } from '../../../util/ToolUtil';
import MyPicker from '../../components/MyPicker';
import Customers from '../ProcessTask/MyAudit/components/Customers';
import CheckUser from '../../components/CheckUser';
import Label from '../../components/Label';
import StartEndDate from '../../components/StartEndDate';
import { SkuResultSkuJsons } from '../../Scan/Sku/components/SkuResult_skuJsons';
import ShopNumber from '../AddShop/components/ShopNumber';
import MyEllipsis from '../../components/MyEllipsis';
import { supplyList } from '../Sku/SkuList/components/SkuScreen/components/Url';
import MyCheckList from '../../components/MyCheckList';
import { skuList } from '../../Scan/Url';


const Production = () => {

  const percent = 50;

  const history = useHistory();

  const [data, setData] = useState([]);

  const dataRef = useRef();
  const userRef = useRef();

  const screens = [
    { title: '执行中', key: 'status' },
    { title: '产品', key: 'skuId' },
    { title: '客户', key: 'customerId' },
    { title: '执行人', key: 'userId' },
    { title: '执行日期', key: 'createTime' },
  ];

  const [params, setParams] = useState({});

  const [screen, setScreen] = useState({});

  const [screenKey, setScreenkey] = useState();

  const ref = useRef();

  const submit = (data = {}, reset) => {
    const newParmas = reset ? data : { ...params, ...data };
    if (reset) {
      setScreen({});
    }
    setParams(newParmas);
    ref.current?.submit(newParmas);
  };

  return <div className={styles.mainDiv}>
    <MyNavBar title='出库计划列表' />
    <MySearch />

    <div
      style={{ borderBottom: '1px solid var(--body--background--color)' }}
      className={style.screent}
    >
      <div className={style.dropDown} style={{ padding: '10px 8px', gap: 8 }}>
        {
          screens.map((item) => {
            let title = '';
            switch (item.key) {
              case 'userId':
                title = screen.userName;
                break;
              case 'createTime':
                title = params.beginTime ? moment(params.beginTime).format('MM/DD') + '-' + moment(params.endTime).format('MM/DD') : '';
                break;
              case 'customerId':
                title = screen.customerName;
                break;
              case 'status':
                title = screen.status;
                break;
              case 'skuId':
                title = screen.skuResult;
                break;
            }
            const check = title || screenKey === item.key;
            return <div
              style={{ width: `${parseInt(100 / screens.length)}%` }}
              className={classNames(style.titleBox, check && style.checked)}
              key={item.key}
              onClick={() => {
                switch (item.key) {
                  case 'userId':
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

    <MyList
      ref={ref}
      data={data}
      api={productionPlanList}
      getData={(data) => {
        setData(data.filter(() => true));
      }}>
      {
        data.map((item, index) => {
          return <div
            onClick={() => {
              history.push(`/Work/Production/ProductionDetail?id=${item.productionPlanId}`);
            }}
            key={index}
            className={styles.item}
          >
            <div className={styles.title}>
              <div className={styles.status}>
                <div className={styles.theme}>{item.theme || '无主题'}</div>
                <Tag color='primary' fill='outline' className={styles.biao}>
                  执行中
                </Tag>
              </div>
              <div className={styles.time}>{MyDate.Show(item.createTime)}</div>
            </div>
            <div className={styles.row}>
              <Label className={styles.label}>产品</Label>：
              <div className={styles.flexGrow}>
                {
                  isArray(item.planDetailResults).map((item, index) => {
                    return <div key={index} className={styles.spuItem}>
                      <div className={styles.sku}>
                        <MyEllipsis maxWidth={300}>{SkuResultSkuJsons({ skuResult: item.skuResult })}</MyEllipsis>
                      </div>
                      <div>× {item.planNumber}</div>
                    </div>;
                  })
                }
              </div>
            </div>
            <div className={styles.row}>
              <Label className={styles.label}>执行时间</Label>：2022年11月12日-2023年1月28日
            </div>
            <div className={styles.row} style={{ display: 'flex' }}>
              <div className={styles.btext}><Label className={styles.label}>执行人</Label>：{item.userResult?.name || '无'}
              </div>
              <div className={styles.btext3}>
                <Label
                  className={styles.label}>申请人</Label>：{item.createUserResult?.name || '无'}
              </div>
            </div>
            <MyProgress className={styles.tiao} percent={percent} />
          </div>;
        })
      }
    </MyList>

    <MyPicker
      visible={screenKey === 'status'}
      value={params.inStockStatus}
      onChange={(option) => {
        submit({ status: option.value });
        setScreen({ ...screen, status: option.label });
        setScreenkey('');
      }}
      options={[
        { label: '执行中', value: '执行中' },
        { label: '完成', value: '完成' },
      ]}
      onClose={() => setScreenkey('')}
    />

    <MyCheckList
      searchPlaceholder='请输入物料信息'
      api={skuList}
      searchLabel='skuName'
      labelFormat={(item) => {
        return SkuResultSkuJsons({ skuResult: item });
      }}
      listKey='skuId'
      onClose={() => setScreenkey('')}
      onChange={(sku) => {
        submit({ skuId: sku?.skuId });
        setScreen({ ...screen, skuResult: SkuResultSkuJsons({ skuResult: sku }) });
        setScreenkey('');
      }}
      value={params.skuId ? [{ skuId: params.skuId, sku: screen.skuResult }] : []}
      visible={screenKey === 'skuId'}
      title='选择产品'
    />

    <Customers
      data={{ supply: 0 }}
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
      value={params.userId ? [{ id: params.userId }] : []}
      onChange={(users) => {
        submit({ userId: isObject(users[0]).id });
        setScreen({ ...screen, userName: isObject(users[0]).name });
        setScreenkey('');
      }}
    />

    <BottomButton
      only
      onClick={() => {
        history.push('/Work/Production/CreatePlan');
      }}
      text='创建计划'
    />
  </div>;
};

export default Production;
