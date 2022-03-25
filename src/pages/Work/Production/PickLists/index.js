import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import {
  productionPickListsList,
  productionPickListsSelfList,
  productionTaskList,
  productionTaskReceive,
} from '../components/Url';
import { CapsuleTabs, Card, Dialog, Space, Tabs, Toast } from 'antd-mobile';
import { history } from 'umi';
import { MyLoading } from '../../../components/MyLoading';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import MyNavBar from '../../../components/MyNavBar';
import MySearchBar from '../../../components/MySearchBar';
import MyList from '../../../components/MyList';
import styles from '../index.css';
import Label from '../../../components/Label';


const PickLists = (props) => {

  const params = props.location.query;

  const [data, setData] = useState([]);

  const [state, setState] = useState('0');

  const ref = useRef();

  const status = (state) => {
    switch (state) {
      case 99:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
    }
  };

  const type = (value, data) => {
    switch (value) {
      case 'user':

        break;
      case 'create':

        break;
      case 'get':

        break;
      default:
        break;
    }
  };


  return <>
    <div style={{ position: 'sticky', top: 0, zIndex: 99, backgroundColor: '#fff' }}>
      <MyNavBar title='领料单列表' />
      <MySearchBar extra onChange={(value) => {
        ref.current.submit({ coding: value });
      }} />
      <CapsuleTabs activeKey={state} onChange={(value) => {
        setState(value);
        switch (value) {
          case 0:

            break;
          default:

            break;
        }
      }}>
        <CapsuleTabs.Tab title='全部' key='0' />
        <CapsuleTabs.Tab title='执行中' key='98' />
        <CapsuleTabs.Tab title='已完成' key='99' />
      </CapsuleTabs>
    </div>
    <MyList
      ref={ref}
      data={data}
      api={params.type === 'all' ? productionPickListsList : productionPickListsSelfList}
      getData={(data) => {
        setData(data.filter(() => true));
      }}>
      {
        data.map((item, index) => {
          return <Card
            onClick={() => {
              Toast.show({
                content: '暂未开通，等两天啊',
              });
              // history.push(`/Work/ProductionTask/Detail?id=${item.productionTaskId}`);
            }}
            key={index}
            title={<Space align='start'>
              {status(item.status)}
              <div>
                {/*编号：{item.coding}*/}
              </div>
            </Space>} className={styles.item}>
            <Space direction='vertical'>
              <div>
                <Label>任务编码：</Label>{item.productionTaskResult && item.productionTaskResult.coding}
              </div>
              <div>
                <Label>领料人：</Label>{item.userResult && item.userResult.name}
              </div>
              <div>
                <Label>创建时间：</Label>{item.createTime}
              </div>
            </Space>
          </Card>;
        })
      }
    </MyList>
  </>;
};

export default PickLists;
