import React, { useImperativeHandle, useRef, useState } from 'react';
import MyList from '../../../../components/MyList';
import { Card, Space } from 'antd-mobile';
import { purchaseAskList } from '../Url';
import { history } from 'umi';
import BottomButton from '../../../../components/BottomButton';

const AskList = ({ ...props }, ref) => {

  const listRef = useRef();

  useImperativeHandle(ref, () => ({
    submit: listRef.current.submit,
  }));

  const [data, setData] = useState({
    array: [],
  });

  const status = (value) => {
    switch (value) {
      case 0:
        return '审批中';
      case 2:
        return '已通过';
      case 1:
        return '已拒绝';
      case 4:
        return '采购中';
      case 5:
        return '已完成';
      default:
        break;
    }
  };

  const type = (value) => {
    switch (value) {
      case '0':
        return '生产采购';
      case '1':
        return '库存采购';
      case '2':
        return '行政采购';
      case '3':
        return '销售采购';
      case '4':
        return '紧急采购';
      default:
        break;
    }
  };

  return <>

    <MyList
      ref={listRef}
      api={purchaseAskList}
      data={data.array}
      getData={(value) => {
        setData({ array: value });
      }}>
      {
        data.array && data.array.map((items, index) => {
          return <Card
            onClick={() => {

            }}
            style={{ marginBottom: 8 }}
            key={index}
            title={
              <Space align='center'>
                <strong style={{ fontSize: 16 }}>{status(items.status)}</strong>
                {type(items.type)}
              </Space>
            }
            extra={
              items.createTime
            }
          >
            <Space direction='vertical'>
              <div>
                申请人：{items.createUserName}
              </div>
              <div>
                申请品类：{items.applyType}
              </div>
              <div>
                申请数量：{items.applyNumber}
              </div>
              <div>
                处理时间：{items.viewUpdate && items.viewUpdate.updateTime}
              </div>
              <div>
                经办人：{items.viewUpdate && items.viewUpdate.updateUser && items.viewUpdate.updateUser.name}
              </div>
            </Space>
          </Card>;
        })
      }
    </MyList>

    <BottomButton
      only
      onClick={() => {
        history.push('/Receipts/ReceiptsCreate?type=purchaseAsk');
      }}
      text='创建申请'
    />
  </>;
};

export default React.forwardRef(AskList);
