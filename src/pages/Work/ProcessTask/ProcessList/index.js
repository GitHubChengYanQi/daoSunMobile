import React, { useState } from 'react';
import style from '../MyAudit/index.less';
import MyList from '../../../components/MyList';
import { ClockCircleOutline } from 'antd-mobile-icons';
import { ReceiptsEnums } from '../../../Receipts';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import { useHistory } from 'react-router-dom';


const startList = {
  url: '/activitiProcessTask/auditList',
  method: 'POST',
};

const ProcessList = (
  {
    setNumber = () => {
    },
    listRef,
  },
) => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const receiptsData = (type, receipts = {}) => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        const details = receipts.instockListResults || [];
        return <div className={style.content}>
          <div>单据编号：{receipts.coding}</div>
          <div className={style.other}>
            入库物料：{
            details.map((item, index) => {
              const skuResult = item.skuResult || {};
              return SkuResultSkuJsons({ skuResult});
            }).join('、')
          }
          </div>
        </div>;
      case ReceiptsEnums.instockError:
        return <div className={style.content}>
          <div>单据编号：{receipts.coding}</div>
          {/*<div className={style.other}>*/}
          {/*  异常物料：{*/}
          {/*  details.map((item, index) => {*/}
          {/*    const skuResult = item.skuResult || {};*/}
          {/*    const spuResult = item.spuResult || {};*/}
          {/*    return SkuResultSkuJsons({ skuResult: { ...skuResult, spuResult } });*/}
          {/*  }).join('、')*/}
          {/*}*/}
          {/*</div>*/}
        </div>;
      default:
        return <></>;
    }
  };

  return <>
    <div className={style.list}>
      <MyList
        ref={listRef}
        api={startList}
        params={{ auditType: 'audit' }}
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
                  <div className={style.name}>{item.taskName}</div>
                  <span>· {receipts.statusName}</span>
                </div>
                <div className={style.time}>
                  <ClockCircleOutline /> {item.createTime}
                </div>
              </div>
              {receiptsData(item.type, item.receipts)}

            </div>;
          })
        }
      </MyList>
    </div>
  </>;
};

export default ProcessList;
