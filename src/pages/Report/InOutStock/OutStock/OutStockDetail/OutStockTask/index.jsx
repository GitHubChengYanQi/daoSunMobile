import React, { useEffect, useRef, useState } from 'react';
import MyNavBar from '../../../../../components/MyNavBar';
import MySearch from '../../../../../components/MySearch';
import MyCard from '../../../../../components/MyCard';
import LinkButton from '../../../../../components/LinkButton';
import { Space } from 'antd-mobile';
import moment from 'moment';
import { DownOutline, RightOutline } from 'antd-mobile-icons';
import style from '../index.less';
import Icon from '../../../../../components/Icon';
import TaskItem from '../../../../../Work/Stock/Task/components/TaskItem';
import MyAntPopup from '../../../../../components/MyAntPopup';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../Work/AddShop/components/ShopNumber';
import { useLocation } from 'react-router-dom';
import { ReceiptsEnums } from '../../../../../Receipts';
import { useRequest } from '../../../../../../util/Request';
import { outstockDetailView } from '../index';
import { MyLoading } from '../../../../../components/MyLoading';
import { isArray } from '../../../../../../util/ToolUtil';
import { OutStockDataView } from '../../index';
import ProcessList from '../../../../../Work/ProcessTask/ProcessList';
import MyEmpty from '../../../../../components/MyEmpty';
import StartEndDate from '../../../../../components/StartEndDate';

const OutStockTask = () => {

  const { query } = useLocation();

  const pickUserId = query.userId;
  const userName = query.userName;

  const defaultParams = { type: ReceiptsEnums.outstockOrder, pickUserId };

  const listRef = useRef();

  const [date, setDate] = useState([]);

  const [visible, setVisible] = useState(false);

  const [search, setSearch] = useState('');

  const { loading, data ,run} = useRequest({ ...outstockDetailView, data: { userId:pickUserId } });

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({
    ...OutStockDataView,
    data: { userId:pickUserId },
  });

  useEffect(() => {
    listRef.current?.submit(defaultParams);
  }, []);

  return <>
    <MyNavBar title='出库任务明细' />
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
      titleBom={userName}
      extra={<StartEndDate
        max={new Date()}
        value={date}
        onChange={(date) => {
          viewRun({ data: { beginTime: date[0], endTime: date[1], userId:pickUserId } });
          run({ data: { beginTime: date[0], endTime: date[1], userId:pickUserId } });
          listRef.current?.submit({ ...defaultParams, startTime: date[0], endTime: date[1],pickUserId });
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
          <Icon type='icon-rukuzongshu' style={{marginRight:8,fontSize:18}} />
          出库总数
          <span className='numberBlue'>{view?.outSkuCount || 0}</span>类
          <span className='numberBlue'>{view?.outNumCount || 0}</span>件
        </div>
        <div className={style.taskTotal}>
          <RightOutline style={{ fontSize: 12 }} />
        </div>
      </div>
    </div>

    <ProcessList noProgress manual listRef={listRef} />

    <MyAntPopup visible={visible} onClose={() => setVisible(false)} title='物料明细'>
      <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
        {!loading && isArray(data).length === 0 && <MyEmpty />}
        {
          loading ? <MyLoading skeleton /> : isArray(data).map((item, index) => {
            return <div key={index} className={style.skuItem}>
              <SkuItem
                extraWidth='80px'
                skuResult={item.skuResult}
                className={style.sku}
                otherData={[
                  item.brandResult?.brandName || '无品牌',
                ]}
              />
              <ShopNumber show value={(item.pickNumCount || 0) + (item.outNumCount || 0)} />
            </div>;
          })
        }
      </div>
    </MyAntPopup>

    {viewtLoading && <MyLoading />}
  </>;
};

export default OutStockTask;
