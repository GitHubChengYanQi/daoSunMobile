import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { useHistory, useLocation } from 'react-router-dom';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import StocktaskingHandle
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import { MyLoading } from '../../../components/MyLoading';
import Icon from '../../../components/Icon';
import { inventoryComplete } from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking';
import { Message } from '../../../components/Message';
import { ToolUtil } from '../../../../util/ToolUtil';
import { Dropdown, Selector } from 'antd-mobile';
import MyPositions from '../../../components/MyPositions';
import { SelectorStyle } from '../../../Report/InOutStock';

export const taskList = { url: '/inventoryStock/list', method: 'POST' };
export const detail = { url: '/inventory/detail', method: 'POST' };
export const getStatistics = { url: '/inventoryStock/speedProgress', method: 'POST' };

const StartStockTaking = () => {

  const { query } = useLocation();

  const show = { ...query }.hasOwnProperty('show');

  const [positionIds,setPositionIds] = useState([]);

  const history = useHistory();

  const listRef = useRef();

  const [data, setData] = useState([]);

  const [visible, setVisible] = useState();

  const [statistics, setStatistics] = useState({});

  const { loading: detailLoading, data: detailInfo, run: detailRun } = useRequest(detail, { manual: true });

  const { loading, run } = useRequest(inventoryComplete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        history.goBack();
      });
    },
  });

  const { loading: statisticsLoading, run: statisticsRun, refresh: statisticsRefresh } = useRequest(getStatistics, {
    manual: true,
    onSuccess: (res) => {
      setStatistics(res);
    },
  });

  useEffect(() => {
    statisticsRun({ data: { inventoryId: query.id } });
    detailRun({ data: { inventoryTaskId: query.id } });
  }, []);

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

  if (detailLoading) {
    return <MyLoading skeleton />;
  }

  if (!query.id || !detailInfo) {
    return <MyEmpty />;
  }

  return <div style={{ backgroundColor: '#fff', height: '100%', overflow: 'auto', paddingBottom: 60 }}>
    <MyNavBar title='盘点任务' />
    <MySearch
      extraIcon={<Icon
        type={params.positionId ?'icon-pandiankuwei1' : 'icon-pandiankuwei'}
        style={{ fontSize: 20 }}
        onClick={() => {
          setVisible(true);
        }} />}
      value={searchValue}
      placeholder='搜索物料信息'
      onChange={setSearchValue}
      onSearch={(value) => {
        submit({ skuName: value });
      }} onClear={() => {
      submit({ skuName: null });
    }} />
    <div className={style.header} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
      <div className={style.number}>
        涉及
        <span className='blue'>{statistics.positionNum || 0}</span> 个库位
        <span className='blue'>{statistics.skuNum || 0}</span>类物料
      </div>
      <div className={style.screen}>
        <div className={style.screenItem} onClick={() => {
          submit({ positionSort: params.positionSort === 'asc' ? 'desc' : 'asc' });
        }}>
          <span>库位</span> {sortShow(params.positionSort)}
        </div>
        <Dropdown className={style.dropdown}>
          <Dropdown.Item key='sorter' title='状态'>
            <div style={{ padding: 12 }}>
              <Selector
                columns={3}
                style={{
                  ...SelectorStyle,
                  fontSize: 12,
                }}
                showCheckMark={false}
                options={[{ label: '进行中', value: 0 }, { label: '暂存中', value: 2 }, {
                  label: '正常物料',
                  value: 1,
                }, { label: '异常物料', value: -1 }]}
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

    <StocktaskingHandle
      getPositionIds={setPositionIds}
      refresh={statisticsRefresh}
      shopCartNum={statistics.shopCartNum}
      show={show}
      listRef={listRef}
      api={taskList}
      params={params}
      inventoryTaskId={query.id}
      anomalyType='StocktakingError'
      showStock={detailInfo.method === 'OpenDisc'}
      data={data}
      setData={setData}
      complete={() => {
        run({ data: { inventoryId: query.id } });
      }}
    />

    <MyPositions
      showAll
      showPositionIds={positionIds}
      empty
      visible={visible}
      single
      autoFocus
      value={params.positionId ? [{ id: params.positionId }] : []}
      onClose={() => setVisible(false)}
      onSuccess={(value = []) => {
        const positions = value[0] || {};
        submit({ positionId: positions.id });
        setVisible(false);
      }} />

    {(loading || statisticsLoading) && <MyLoading />}
  </div>;
};

export default StartStockTaking;
