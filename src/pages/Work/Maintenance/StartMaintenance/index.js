import React, { useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import Icon from '../../../components/Icon';
import { ToolUtil } from '../../../components/ToolUtil';
import { Dropdown, Selector } from 'antd-mobile';
import MaintenanceAction
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Maintenance/components/MaintenanceAction';

export const curingList = { url: '/maintenanceDetail/list', method: 'POST' };

const StartMaintenance = () => {

  const { query } = useLocation();

  const show = { ...query }.hasOwnProperty('show');

  const listRef = useRef();

  const [data, setData] = useState([]);

  const [params, setParams] = useState({ positionSort: 'asc', inventoryId: query.id });

  const [searchValue, setSearchValue] = useState();

  const submit = (newParams = {}) => {
    setParams({ ...params, ...newParams });
    listRef.current.submit({ ...params, ...newParams });
  };

  const sortShow = (order) => {

    switch (order) {
      case  'asc' :
        return <Icon type='icon-paixubeifen' />;
      case  'desc' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  if (!query.id) {
    return <MyEmpty />;
  }

  return <div style={{ backgroundColor: '#fff', height: '100%', overflow: 'auto' }}>
    <MyNavBar title='养护任务' />
    <MySearch
      value={searchValue}
      placeholder='搜索物料信息'
      onChange={setSearchValue}
      onSearch={(value) => {
        submit({ skuName: value });
      }} onClear={() => {
      submit({ skuName: null });
    }} />
    <div className={style.header} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
      <div className={style.number}>涉及 <span className='blue'>{data.length}</span> 个库位 <span className='blue'>22</span>类物料
      </div>
      <div className={style.screen}>
        <div onClick={() => {
          submit({ positionSort: params.positionSort === 'asc' ? 'desc' : 'asc' });
        }}>
          库位 {sortShow(params.positionSort)}
        </div>
        <Dropdown className={style.dropdown}>
          <Dropdown.Item key='sorter' title='状态'>
            <div style={{ padding: 12 }}>
              <Selector
                columns={3}
                style={{
                  fontSize: 12,
                  '--border': 'solid transparent 1px',
                  '--checked-border': 'solid var(--adm-color-primary) 1px',
                  '--padding': '4px 15px',
                }}
                showCheckMark={false}
                options={[{ label: '进行中', value: 0 }, { label: '已完成', value: 2 }]}
                value={[params.status]}
                onChange={(v = []) => {
                  submit({ status: v[0] });
                }}
              />
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </div>

    <MaintenanceAction
      api={curingList}
      data={data}
      setData={setData}
      actionPermissions
      maintenanceId
      refresh
    />;
  </div>;
};

export default StartMaintenance;
