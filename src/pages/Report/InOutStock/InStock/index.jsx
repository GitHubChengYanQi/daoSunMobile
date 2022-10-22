import React, { useEffect, useRef, useState } from 'react';
import style from '../index.less';
import MySearch from '../../../components/MySearch';
import MyCard from '../../../components/MyCard';
import { Space } from 'antd-mobile';
import Icon from '../../../components/Icon';
import { useHistory, useLocation } from 'react-router-dom';
import MyFloatingBubble from '../../../components/FloatingBubble';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyList from '../../../components/MyList';
import { isObject } from '../../../components/ToolUtil';
import { message } from 'antd';

export const InStockDataList = { url: '/statisticalView/instockView', method: 'POST' };
export const InStockExport = { url: '/viewExcel/export', method: 'GET' };
export const InStockViewTotail = { url: '/statisticalView/viewTotail', method: 'POST' };

const InStock = (
  {
    date = [],
  },
) => {

  const history = useHistory();

  const listRef = useRef();

  const [list, setList] = useState([]);

  const { loading: exportLoading, run: exportRun } = useRequest(InStockExport, {
    manual: true,
    onSuccess: () => {
      message.success('导出成功！请注意查收');
    },
    onError: () => message.error('导出失败！请联系管理员'),
  });

  const { loading: viewtLoading, data: view, run: viewRun } = useRequest({ ...InStockViewTotail, data: {} });

  useEffect(() => {
    if (date.length > 0) {
      viewRun({ data: { beginTime: date[0], endTime: date[1] } });
      listRef.current.submit({ beginTime: date[0], endTime: date[1] });
    }
  }, [date]);

  return <>
    <div className={style.total}>
      <div className={style.number}>
        <Icon type='icon-rukuzongshu' style={{marginRight:8,fontSize:18}} />
        入库总数
        <span className='numberBlue'>{view?.detailSkuCount || 0}</span>类
        <span className='numberBlue'>{view?.detailNumberCount || 0}</span>件
      </div>
      <div className={style.otherNUmber}>
        <div>
          <div>收货总数</div>
          <div className={style.num}>
            <span className='numberBlue'>{view?.logSkuCount || 0}</span>类
            <span style={{ marginLeft: 12 }} className='numberBlue'>{view?.logNumberCount || 0}</span>件
          </div>
        </div>
        <div>
          <div>退货总数</div>
          <div className={style.num}>
            <span className='numberRed'>{view?.errorSkuCount || 0}</span>类
            <span style={{ marginLeft: 12 }} className='numberRed'>{view?.errorNumberCount || 0}</span>件
          </div>
        </div>
      </div>
    </div>

    <MySearch placeholder='请输入供应商相关信息' style={{ marginTop: 8, padding: '8px 12px', marginBottom: 4 }} />

    <MyList ref={listRef} api={InStockDataList} data={list} getData={setList}>
      {
        list.map((item, index) => {
          return <MyCard
            onClick={() => {
              history.push({
                pathname: '/Report/InOutStock/InStock/InStockDetail',
                query: {
                  customerId: item.customerId,
                  customerName: item.customerName,
                },
              });
            }}
            key={index}
            className={style.card}
            headerClassName={style.cardHeader}
            titleBom={<Space align='center'>
              <div className={style.yuan} />
              {item.customerName}
            </Space>}
          >
            <div className={style.info}>
              <div>
                <div className={style.numberTitle}>到货数量</div>
                <div className={style.cardNum}>
                  <span style={{ padding: '0 4px' }}>{item.detailSkuCount}</span>类
                  <span style={{ marginLeft: 4, padding: '0 4px' }}>{item.detailNumberCount}</span>件
                </div>
              </div>
              <div>
                <div className={style.numberTitle}>入库数量</div>
                <div className={style.cardNum}>
                  <span className='numberBlue'>{item.logSkuCount}</span>类
                  <span style={{ marginLeft: 4 }} className='numberBlue'>{item.logNumberCount}</span>件
                </div>
              </div>
              <div>
                <div className={style.numberTitle}>退货数量</div>
                <div className={style.cardNum}>
                  <span className='numberRed'>{item.errorSkuCount}</span>类
                  <span style={{ marginLeft: 4 }} className='numberRed'>{item.errorNumberCount}</span>件
                </div>
              </div>
            </div>
          </MyCard>;
        })
      }
    </MyList>

    {(exportLoading || viewtLoading) && <MyLoading />}

    <MyFloatingBubble><Icon type='icon-download-2-fill' onClick={() => {
      exportRun();
    }} /></MyFloatingBubble>
  </>;
};

export default InStock;
