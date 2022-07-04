import React, { useState } from 'react';
import style from '../MyAudit/index.less';
import MyList from '../../../components/MyList';
import { ClockCircleOutline } from 'antd-mobile-icons';
import { ReceiptsEnums } from '../../../Receipts';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useHistory } from 'react-router-dom';
import { MyDate } from '../../../components/MyDate';
import { ToolUtil } from '../../../components/ToolUtil';


const startList = {
  url: '/activitiProcessTask/auditList',
  method: 'POST',
};

const ProcessList = (
  {
    setNumber = () => {
    },
    listRef,
    api,
  },
) => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const receiptsData = (item) => {
    const receipts = item.receipts || {}
    switch (item.type) {
      case ReceiptsEnums.instockOrder:
        const instockListResults = receipts.instockListResults || [];
        return <div className={style.content}>
          <div className={style.orderData}>
            <span className={style.coding}>单据编号：{receipts.coding}</span>
            <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
          </div>
          <div className={style.other}>
            入库物料：{
            instockListResults.map((item) => {
              const skuResult = item.skuResult || {};
              return SkuResultSkuJsons({ skuResult });
            }).join('、')
          }
          </div>
        </div>;
      case ReceiptsEnums.instockError:
      case ReceiptsEnums.stocktaking:
      case ReceiptsEnums.maintenance:
        return <div className={style.content}>
          <div className={style.orderData}>
            <span className={style.coding}>单据编号：{receipts.coding || '-'}</span>
            <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
          </div>
        </div>;
      case 'ErrorForWard':
        return <div className={style.content}>
          <div className={style.orderData}>
            <span className={style.coding}>关联单据：{ToolUtil.isObject(receipts.orderResult).coding}</span>
            <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
          </div>
        </div>;
      case ReceiptsEnums.outstockOrder:
        const detailResults = receipts.detailResults || [];
        return <div className={style.content}>
          <div className={style.orderData}>
            <span className={style.coding}>单据编号：{receipts.coding}</span>
            <span className={style.time}><ClockCircleOutline /> {MyDate.Show(item.createTime)}</span>
          </div>
          <div className={style.other}>
            出库物料：{
            detailResults.map((item) => {
              const skuResult = item.skuResult || {};
              return SkuResultSkuJsons({ skuResult });
            }).join('、')
          }
          </div>
        </div>;
      default:
        return <></>;
    }
  };

  return <>
    <div className={style.list}>
      <MyList
        ref={listRef}
        api={api || startList}
        params={{ auditType: 'audit' }}
        sorter={{field:'createTime',order:'ascend'}}
        data={data}
        getData={setData}
        response={(res) => {
          setNumber(res.count);
        }}
      >
        {
          data.map((item, index) => {
            const receipts = item.receipts || {};
            return <div key={index} className={style.item} onClick={() => {
              history.push(`/Receipts/ReceiptsDetail?id=${item.processTaskId}`);
            }}>
              <div className={style.header}>
                <div className={style.title}>
                  {item.taskName}
                </div>
                <div className={style.status}>
                  · {receipts.statusName}
                </div>
              </div>
              {receiptsData(item, item.receipts)}

            </div>;
          })
        }
      </MyList>
    </div>
  </>;
};

export default ProcessList;
