import React, { useRef } from 'react';
import MyList from '../../components/MyList';
import { Card, List } from 'antd-mobile';
import { history } from 'umi';
import { procurementOrderList } from './Url';
import { useSetState } from 'ahooks';
import LinkButton from '../../components/LinkButton';

const ProcurementOrder = () => {

  const ref = useRef();

  const [data, setData] = useSetState({});

  return <Card title='采购单列表' extra={<LinkButton title='返回' onClick={()=>{history.goBack()}} />}>
    <MyList
      ref={ref}
      api={procurementOrderList}
      data={data}
      getData={(value) => {
        setData({ data: value });
      }}>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          data.data && data.data.map((item, index) => {
            return <List.Item
              key={index}
              title={item.procurementOrderId}
              extra={<></>}
              description={item.createTime}
              onClick={() => {
                history.push(`/Work/ProcurementOrder/Detail?id=${item.procurementOrderId}`);
              }}
            >
              创建人：{item.user && item.user.name}
            </List.Item>;
          })
        }
      </List>
    </MyList>
  </Card>;
};

export default ProcurementOrder;
