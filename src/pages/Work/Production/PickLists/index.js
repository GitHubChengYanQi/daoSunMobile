import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionPickListsList, productionTaskList, productionTaskReceive } from '../components/Url';
import { CapsuleTabs, Card, Dialog, Space, Tabs, Toast } from 'antd-mobile';
import { history } from 'umi';
import { MyLoading } from '../../../components/MyLoading';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import MyNavBar from '../../../components/MyNavBar';
import MySearchBar from '../../../components/MySearchBar';
import MyList from '../../../components/MyList';
import styles from '../index.css';
import Label from '../../../components/Label';
import LinkButton from '../../../components/LinkButton';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';


const PickLists = () => {

  const [data, setData] = useState([]);

  const [state, setState] = useState('0');

  const ref = useRef();

  const status = (state) => {
    switch (state) {
      case 98:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
      case 99:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return '';
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
      api={productionPickListsList}
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
                编号：{item.coding}
              </div>
            </Space>} className={styles.item}>
            <Space direction='vertical'>
              <div>
                <Label>工序：</Label>
                {
                  item.workOrderResult
                  &&
                  item.workOrderResult.setpSetResult
                  &&
                  item.workOrderResult.setpSetResult.shipSetpResult
                  &&
                  item.workOrderResult.setpSetResult.shipSetpResult.shipSetpName
                }
              </div>
              <div>
                <Label>执行数量：</Label> {item.number}
              </div>
              <div>
                <Label>执行时间：</Label>{item.productionTime}
              </div>
              <div>
                <Label>结束时间：</Label>{item.endTime}
              </div>
              <div>
                <Label>负责人：</Label>{
                item.userResult && item.userResult.name
                ||
                <LinkButton>
                  <Space align='center'>
                    <Avatar size={24}> <span style={{ fontSize: 14 }}><UserOutlined /></span></Avatar>待认领
                  </Space>
                </LinkButton>
              }
              </div>
              <div>
                <Label>成员：</Label>{item.userResults && item.userResults.map((item) => {
                return item.name;
              }).join(',')}
              </div>
              <div>
                <Label>分派人：</Label>{item.createUserResult && item.createUserResult.name}
              </div>
              <div>
                <Label>分派时间：</Label>{item.createTime}
              </div>
            </Space>
          </Card>;
        })
      }
    </MyList>
  </>;
};

export default PickLists;
