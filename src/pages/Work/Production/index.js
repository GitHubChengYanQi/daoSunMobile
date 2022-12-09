import React, { useRef, useState } from 'react';
import { Space, Tabs, Tag } from 'antd-mobile';
import styles from './index.less';
import { productionPlanList } from './components/Url';
import MyList from '../../components/MyList';
import MyNavBar from '../../components/MyNavBar';
import Label from '../../components/Label';
import MySearch from '../../components/MySearch';
import { useHistory } from 'react-router-dom';
import BottomButton from '../../components/BottomButton';
import MyProgress from '@/pages/components/MyProgress';
import style from '@/pages/Work/ProcessTask/index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import Icon from '@/pages/components/Icon';
import { MyDate } from '../../components/MyDate';


const Production = () => {

  const percent = 50;

  const history = useHistory();

  const [data, setData] = useState([]);

  const ref = useRef();

  return <div className={styles.mainDiv}>
    <MyNavBar title='生产计划列表' />
    <MySearch />

    <div className={styles.screent}>
      <div className={styles.dropDown}>
        <div className={styles.titleBox}>
          <div className={styles.title}>执行中<DownOutline /></div>
          <div className={styles.title}>产品<DownOutline /></div>
          <div className={styles.title}>客户<DownOutline /></div>
          <div className={styles.title}>执行人<DownOutline /></div>
          <div className={styles.title}>执行日期<DownOutline /></div>
        </div>
        <div className={styles.sort}><Icon type='icon-paixubeifen' /></div>

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
            <Space direction='vertical' style={{ width: '100%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', flexGrow: 1 }}>
                  <div className={styles.btext}>产品：</div>
                  <div className={styles.btext2}>
                    <div className={styles.btext}>
                      T5一米数控车床/T510/500*1000
                    </div>
                    <div className={styles.btext}>
                      T5一米数控车床/T510/500*1000
                    </div>
                    <div className={styles.btext}>
                      T5一米数控车床/T510/500*1000
                    </div>
                  </div>
                </div>
                <div className={styles.btext2}>
                  <div className={styles.btext} style={{ marginLeft: 'auto' }}>×10</div>
                  <div className={styles.btext} style={{ marginLeft: 'auto' }}>×10</div>
                  <div className={styles.btext} style={{ marginLeft: 'auto' }}>×10</div>
                </div>
              </div>
              <div className={styles.btext}>执行时间： 2022年11月12日-2023年1月28日
              </div>
              <div style={{ display: 'flex' }}>
                <div className={styles.btext}>执行人：{item.userResult?.name || '无'}</div>
                <div className={styles.btext3}>申请人：{item.userResult?.name || '无'}</div>
              </div>
            </Space>
            <MyProgress className={styles.tiao} percent={percent} />
          </div>;
        })
      }
    </MyList>


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
