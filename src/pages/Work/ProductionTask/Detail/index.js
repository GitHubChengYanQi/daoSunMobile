import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionTaskDetail } from '../../Production/components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Space, Tabs } from 'antd-mobile';
import styles from '../../Production/index.less';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import BottomButton from '../../../components/BottomButton';
import ReportWork from './components/ReportWork';
import Pick from '../../Production/Pick';
import { history } from 'umi';
import MyCard from '../../../components/MyCard';
import { MyDate } from '../../../components/MyDate';
import style from '../../Production/ProductionDetail/index.less';
import { Avatar } from 'antd';
import Icon from '../../../components/Icon';
import SkuItem from '../../Sku/SkuItem';

const Detail = (props) => {

  const params = props.location.query;

  const [visible, setVisible] = useState();

  const [disabled, setDisabled] = useState(true);

  const { loading, data, run, refresh } = useRequest(productionTaskDetail, {
    manual: true,
    onSuccess: (res) => {
      setDisabled(res.status === 99);
    },
  });

  const setpSetResult = data
    &&
    data.workOrderResult
    &&
    data.workOrderResult.setpSetResult
    &&
    data.workOrderResult.setpSetResult.shipSetpResult
    &&
    data.workOrderResult.setpSetResult || {};

  const shipSetpResult = setpSetResult.shipSetpResult || {};

  const setpSetDetails = setpSetResult.setpSetDetails
    &&
    setpSetResult.setpSetDetails.map((skuItems) => {
      const jobBooking = data.taskDetailResults.filter((item) => {
        return item.jobBookingDetailCount && (item.jobBookingDetailCount.skuId === skuItems.skuId);
      });
      return {
        ...skuItems,
        jobBookNumber: jobBooking
          &&
          jobBooking.length === 1
          &&
          jobBooking[0].jobBookingDetailCount
          &&
          jobBooking[0].jobBookingDetailCount.number
          ||
          0,
      };
    })
    ||
    [];

  const [key, setKey] = useState('out');

  useEffect(() => {
    if (params.id) {
      run({ data: { productionTaskId: params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const status = (state) => {
    switch (state) {
      case 0:
        return <div style={{ color: '#ffa52a' }}>待领取</div>;
      case 98:
        return <div style={{ color: 'blue' }}>执行中</div>;
      case 99:
        return <div style={{ color: 'green' }}>已完成</div>;
      default:
        return '';
    }
  };


  const module = () => {
    switch (key) {
      case 'out':
        return setpSetDetails.length === 0
          ?
          <MyEmpty />
          :
          <div className={styles.skus}>
            {
              setpSetDetails.map((item, index) => {
                const skuResult = item.skuResult || {};
                return <div key={index} className={styles.skuItem}
                            style={{ border: index === setpSetDetails.length - 1 && 'none' }}>
                  <SkuItem
                    skuResult={skuResult}
                    otherData={[
                      <div style={{ display: 'flex' }}>
                        <div style={{ flexGrow: 1, color: 'green' }}>
                          <Label>已报工：</Label>{item.jobBookNumber}
                        </div>
                        <div style={{ flexGrow: 1, color: 'var(--adm-color-primary)', marginLeft: 16 }}>
                          <Label>生产数：</Label>{item.num * data.number}
                        </div>

                      </div>,
                    ]}
                  />
                </div>;
              })
            }
          </div>;
      case 'in':
        return <Pick module='task' id={params.id} />;
      case 'use':
        return <MyEmpty />;
      default:
        return <></>;
    }
  };

  const bottomBotton = () => {
    switch (key) {
      case 'out':
        return <BottomButton
          only
          disabled={disabled}
          text={data.status === 99 ? '已完成' : '产出报工'}
          right
          onClick={() => {
            setVisible(true);
          }} />;
      case 'in':
        return <BottomButton
          only
          text='我的领料'
          leftOnClick={() => {
            history.push('/Work/Production/MyCart');
          }}
        />;
      default:
        return <></>;
    }
  };

  return <div>
    <MyNavBar title='任务详情' />
    <div className={style.header}>
      <Avatar className={style.avatar} src={data.createUserResult?.avatar} size={60}>
        {(data.createUserResult?.name || '').substring(0, 1)}
      </Avatar>
      <div className={style.data}>
        <div className={style.line}>
          <div className={style.name}>
            {shipSetpResult.shipSetpName}
          </div>
          <span>
          <div style={{display:'flex',alignItems:'center'}}><Icon type='icon-dian' /> {status(data.status)}</div>
        </span>
        </div>
        <div className={style.line}>
          <div>
            {data.coding}
          </div>
          <span className={style.time}>{MyDate.Show(data.createTime)}</span>
        </div>
      </div>
    </div>
    <div>
      <Tabs
        activeKey={key}
        style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
        onChange={(key) => {
          switch (key) {
            case 'out':
              setDisabled(data.status === 99);
              break;
            case 'in':
              break;
            default:
              break;
          }
          setKey(key);
        }}
      >
        <Tabs.Tab title='产出明细' key='out' />
        <Tabs.Tab title='投入明细' key='in' />
        <Tabs.Tab title='领用明细' key='use' />
      </Tabs>
      <div style={{ backgroundColor: '#eee' }}>
        {module()}
      </div>

      <MyCard
        title='执行数量'
        extra={data.number}
      />

      <MyCard
        title='标准作业指导'
        extra={shipSetpResult.sopResult && shipSetpResult.sopResult.name}
      />

      <MyCard
        title='执行时间'
        extra={MyDate.Show(data.productionTime) + ' - ' + MyDate.Show(data.endTime)}
      />

      <MyCard
        title='负责人'
        extra={data.userResult && data.userResult.name}
      />

      <MyCard
        title='成员'
        extra={data.userResults && data.userResults.map((item) => {
          return item.name;
        }).join(',')}
      />

      <MyCard
        title='备注'
        extra={data.remark}
      />
    </div>

    {bottomBotton()}

    <ReportWork
      productionTaskId={params.id}
      skuData={setpSetDetails.map((item) => {
        return {
          ...item,
          maxNumber: (item.num * data.number) - item.jobBookNumber,
        };
      }).filter(item => item.maxNumber > 0)}
      setVisible={setVisible}
      visible={visible}
      onSuccess={() => {
        setVisible(false);
        refresh();
      }}
    />

  </div>;
};

export default Detail;
