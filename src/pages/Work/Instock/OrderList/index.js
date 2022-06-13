import { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MyList from '../../../components/MyList';
import { Button, Card, Space } from 'antd-mobile';
import { history } from 'umi';
import styles from '../../Production/index.css';
import Label from '../../../components/Label';
import MySearchBar from '../../../components/MySearchBar';
import MyBottom from '../../../components/MyBottom';
import { ReceiptsEnums } from '../../../Receipts';
import { instockOrderList } from '../../Order/Url';

const Orderlist = () => {

  const ref = useRef();

  const [data, setData] = useState([]);

  return <>
    <MyBottom
      leftActuions={<div>待处理：5</div>}
      buttons={<Space>
        <Button>合并入库</Button>
        <Button color='primary' onClick={() => {
          history.push(`/Receipts/ReceiptsCreate?type=${ReceiptsEnums.instockOrder}`);
        }}>新建入库申请</Button>
      </Space>}
    >
      <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}>
        <MyNavBar title='入库单列表' />
        <MySearchBar extra />
      </div>
      <MyList
        ref={ref}
        api={instockOrderList}
        data={data}
        getData={(value) => {
          setData(value.filter(item => item));
        }}>
        {
          data.map((item, index) => {
            return <Card
              key={index}
              title={<div>{item.createTime}</div>}
              className={styles.item}
              extra={<Space>
                {
                  item.urgent
                    ?
                    <Button color='danger' style={{ '--border-radius': '50px', padding: '4px 12px' }}>加急</Button> : null
                }
                {item.statusResult && <Button
                  color='default'
                  fill='outline'
                  style={{
                    '--border-radius': '50px',
                    padding: '4px 12px',
                    '--background-color': '#fff7e6',
                    '--text-color': '#fca916',
                    '--border-width': '0px',
                  }}>{item.statusResult.name || '-'}</Button>}
              </Space>}
              onClick={() => {
                history.push(`/Receipts/ReceiptsDetail?type=${ReceiptsEnums.instockOrder}&formId=${item.instockOrderId}`);
              }}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <div>
                  <Label>入库单编号：</Label>{item.coding}
                </div>
                <div>
                  <Label>入库类型：</Label>{item.type}
                </div>
                <div>
                  <Label>送料人员：</Label>{item.userResult && item.userResult.name}
                </div>
                <div>
                  <Label>送料时间：</Label>{item.registerTime}
                </div>
                <div>
                  <Label>库管人员：</Label>{item.stockUserResult && item.stockUserResult.name}
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flexGrow: 1 }}>
                    <Label>入库物料：</Label>{item.enoughNumber}
                  </div>
                  <div style={{ flexGrow: 1, color: 'green' }}>
                    已入库：{item.notNumber}
                  </div>
                  <div style={{ flexGrow: 1, color: 'red' }}>
                    未入库：{item.realNumber}
                  </div>
                </div>
              </Space>
            </Card>;
          })
        }
      </MyList>
    </MyBottom>
  </>;
};

export default Orderlist;
