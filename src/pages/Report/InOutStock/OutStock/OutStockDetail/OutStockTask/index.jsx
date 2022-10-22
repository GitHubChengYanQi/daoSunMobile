import React, { useState } from 'react';
import MyNavBar from '../../../../../components/MyNavBar';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import StartEndDate from '../../../../../Work/Production/CreateTask/components/StartEndDate';
import LinkButton from '../../../../../components/LinkButton';
import { Space } from 'antd-mobile';
import moment from 'moment';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import style from '../index.less';
import MyFloatingBubble from '../../../../../components/FloatingBubble';
import Icon from '../../../../../components/Icon';
import TaskItem from '../../../../../Work/Stock/Task/components/TaskItem';
import MyAntPopup from '../../../../../components/MyAntPopup';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';

const OutStockTask = () => {

  const [date, setDate] = useState([]);

  const [visible, setVisible] = useState(false);

  return <>
    <MyNavBar title='出库任务明细' />
    <div style={{ margin: '1px 0' }}>
      <MySearch placeholder='搜索' />
    </div>
    <MyCard
      className={style.customerCard}
      titleBom='程彦祺'
      extra={<StartEndDate
        max={new Date()}
        value={date}
        onChange={setDate}
        render={date.length > 0 ?
          <LinkButton>
            <Space align='center'>
              {moment(date[0]).format('MM/DD') + ' - ' + moment(date[1]).format('MM/DD')}
              <DownOutline style={{ fontSize: 12 }} />
            </Space>
          </LinkButton>
          :
          <Space align='center' className={style.placeholder}>请选择时间范围 <DownOutline style={{ fontSize: 12 }} /></Space>}
      />}
    />
    <div className={style.total} onClick={() => {
      setVisible(true);
    }}>
      <div className={style.number}>
        <div>
          <Icon type='icon-rukuzongshu' style={{marginRight:8,fontSize:18}} />
          出库总数
          <span className='numberBlue'>216</span>类
          <span className='numberBlue'>10342</span>件
        </div>
        <div className={style.taskTotal}>
          <RightOutline style={{ fontSize: 12 }} />
        </div>
      </div>
    </div>

    {
      [1, 2].map((item, index) => {
        return <TaskItem noProgress createTime={new Date()} key={index} taskName='xxx的出库申请' statusName='进行中' />;
      })
    }

    <MyAntPopup visible={visible} onClose={() => setVisible(false)} title='物料明细'>
      {
        [1, 2].map((item, index) => {
          return <div key={index} className={style.skuItem}>
            <SkuItem
              className={style.sku}
              otherData={[
                '丹东汉克',
              ]}
            />
            <ShopNumber show value={1} />
          </div>;
        })
      }
    </MyAntPopup>
  </>;
};

export default OutStockTask;
