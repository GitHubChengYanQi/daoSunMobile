import React, { useEffect, useRef, useState } from 'react';
import MyNavBar from '../../../../../components/MyNavBar';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import StartEndDate from '../../../../../Work/Production/CreateTask/components/StartEndDate';
import LinkButton from '../../../../../components/LinkButton';
import { Space } from 'antd-mobile';
import moment from 'moment';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import style from '../index.less';
import Icon from '../../../../../components/Icon';
import MyAntPopup from '../../../../../components/MyAntPopup';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';
import ProcessList from '../../../../../Work/ProcessTask/ProcessList';
import { ReceiptsEnums } from '../../../../../Receipts';
import { useLocation } from 'react-router-dom';
import MyEllipsis from '../../../../../components/MyEllipsis';

const InStockTask = () => {

  const { query } = useLocation();

  const customerId = query.customerId;
  const customerName = query.customerName;

  const defaultParams = { type: ReceiptsEnums.instockOrder, customerId };

  const listRef = useRef();

  const [date, setDate] = useState([]);

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState('');

  useEffect(() => {
    listRef.current?.submit(defaultParams);
  }, []);

  return <>
    <MyNavBar title='入库任务明细' />
    <div style={{ margin: '1px 0' }}>
      <MySearch
        placeholder='搜索'
        onChange={setSearch}
        value={search}
        onSearch={(skuName) => {
          listRef.current?.submit({
            ...defaultParams,
            startTime: date[0] || null,
            endTime: date[1] || null,
            skuName,
          });
        }}
      />
    </div>
    <MyCard
      className={style.customerCard}
      titleBom={<MyEllipsis>{customerName}</MyEllipsis>}
      extra={<StartEndDate
        precision='day'
        max={new Date()}
        value={date}
        onChange={(date) => {
          listRef.current?.submit({ ...defaultParams, startTime: date[0], endTime: date[1] });
          setDate(date);
        }}
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
          <Icon type='icon-rukuzongshu' style={{ marginRight: 8, fontSize: 18 }} />
          入库总数
          <span className='numberBlue'>216</span>类
          <span className='numberBlue'>10342</span>件
        </div>
        <div className={style.taskTotal}>
          <RightOutline style={{ fontSize: 12 }} />
        </div>
      </div>
    </div>

    <ProcessList manual listRef={listRef} />

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

export default InStockTask;
