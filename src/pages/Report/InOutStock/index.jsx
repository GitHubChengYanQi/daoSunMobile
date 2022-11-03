import React, { useState } from 'react';
import style from './index.less';
import { Space, Tabs } from 'antd-mobile';
import StartEndDate from '../../Work/Production/CreateTask/components/StartEndDate';
import moment from 'moment';
import { RightOutline } from 'antd-mobile-icons';
import InStock from './InStock';
import OutStock from './OutStock';
import MyEllipsis from '../../components/MyEllipsis';
import MySearch from '../../components/MySearch';

const InOutStock = () => {

  const [search, setSearch] = useState(true);

  const [key, setKey] = useState('inStock');
  const [date, setDate] = useState([]);

  if (search) {
    return <>
      <MySearch placeholder='请输入相关字段' className={style.search} />
    </>;
  }

  return <>
    <div className={style.header}>
      <div className={style.tabs}>
        <Tabs className={style.inOutStockTabs} activeKey={key} onChange={setKey}>
          <Tabs.Tab title='入库' key='inStock' />
          <Tabs.Tab title='出库' key='outStock' />
        </Tabs>
      </div>
      <div className={style.space} />
      <div className={style.time}>
        <StartEndDate
          precision='day'
          max={new Date()}
          value={date}
          onChange={setDate}
          render={date.length > 0 ?
            <Space align='center'>
              <MyEllipsis width={'100%'} style={{ fontSize: 12, lineHeight: '12px' }}>
                {moment(date[0]).format('YYYY/MM/DD') + ' - ' + moment(date[1]).format('YYYY/MM/DD')}
              </MyEllipsis>
              <RightOutline style={{ fontSize: 12 }} />
            </Space> :
            <Space align='center' className={style.placeholder}>
              请选择时间范围 <RightOutline style={{ fontSize: 12 }} />
            </Space>}
        />
      </div>
    </div>
    {
      key === 'inStock' ? <InStock date={date} /> : <OutStock date={date} />
    }
  </>;
};

export default InOutStock;
