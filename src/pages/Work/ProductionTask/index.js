import React, { useEffect, useRef, useState } from 'react';
import MySearchBar from '../../components/MySearchBar';
import MyList from '../../components/MyList';
import { productionTaskList, productionTaskReceive } from '../Production/components/Url';
import { CapsuleTabs, Card, Dialog, Space, Tabs, Toast } from 'antd-mobile';
import { history } from 'umi';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import styles from '../Production/index.css';
import Label from '../../components/Label';
import MyNavBar from '../../components/MyNavBar';
import LinkButton from '../../components/LinkButton';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import SelectUser from '../Production/CreateTask/components/SelectUser';
import { useModel } from 'umi';

const ProductionTask = () => {

  const { initialState } = useModel('@@initialState');

  const userInfo = initialState.userInfo || {}

  const [data, setData] = useState([]);

  const [user, setUser] = useState();

  const [key, setKey] = useState('user');

  const [state, setState] = useState('0');

  const [visible, setVisible] = useState(false);

  const { loading, run } = useRequest(productionTaskReceive, {
    manual: true,
    onSuccess: (res) => {
      Toast.show({
        content: '领取成功！',
        position: 'bottom',
      });
      if (key !== 'create') {
        history.push(`/Work/ProductionTask/Detail?id=${res.productionTaskId}`);
      } else {
        ref.current.submit({ createUser: userInfo.id });
        setVisible(false);
      }

    },
  });

  const ref = useRef();

  useEffect(() => {
    if (ref && ref.current && userInfo.id) {
      ref.current.submit({ userId: userInfo.id });
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  const status = (state) => {
    switch (state) {
      case 0:
        return <Space style={{ color: '#ffa52a' }}><QuestionCircleOutline />待领取</Space>;
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
        ref.current.submit({ userId: userInfo.id, ...data });
        break;
      case 'create':
        ref.current.submit({ createUser: userInfo.id, ...data });
        break;
      case 'get':
        ref.current.submit({ noUser: true, ...data });
        break;
        case 'in':
        ref.current.submit({ userIds: userInfo.id, ...data });
        break;
      default:
        break;
    }
  };


  return <>
    <div style={{ position: 'sticky', top: 0, zIndex: 99, backgroundColor: '#fff' }}>
      <MyNavBar title='生产任务' />
      <Tabs
        activeKey={key}
        onChange={(value) => {
          setState('0');
          setKey(value);
          type(value);
        }}
      >
        <Tabs.Tab title='我执行的' key='user' />
        <Tabs.Tab title='我分派的' key='create' />
        <Tabs.Tab title='我参与的' key='in' />
        <Tabs.Tab title='待领取的' key='get' />
      </Tabs>
      <MySearchBar extra onChange={(value) => {
        ref.current.submit({ coding: value });
      }} />
      {key !== 'get' && <CapsuleTabs activeKey={state} onChange={(value) => {
        setState(value);
        switch (value) {
          case 0:
            type(key);
            break;
          default:
            type(key, { status: value });
            break;
        }
      }}>
        <CapsuleTabs.Tab title='全部' key='0' />
        <CapsuleTabs.Tab title='执行中' key='98' />
        <CapsuleTabs.Tab title='已完成' key='99' />
      </CapsuleTabs>}
    </div>
    <MyList
      ref={ref}
      data={data}
      api={productionTaskList}
      getData={(data) => {
        setData(data.filter(() => true));
      }}>
      {
        data.map((item, index) => {
          return <Card
            onClick={() => {
              if (item.userId) {
                history.push(`/Work/ProductionTask/Detail?id=${item.productionTaskId}`);
              } else if (key === 'create') {
                setVisible(item.productionTaskId);
              } else {
                Dialog.confirm({
                  content: '是否领取此任务？',
                  onConfirm: async () => {
                    await run({
                      data: {
                        productionTaskId: item.productionTaskId,
                        userId: userInfo.id,
                      },
                    });
                  },
                });
              }
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

    <Dialog
      title='分派任务'
      visible={visible}
      content={<div style={{ textAlign: 'center' }}><SelectUser value={user} onChange={setUser} /></div>}
      onAction={(action) => {
        if (action.key === 'dispatch') {
          if (user && user.id) {
            run({
              data: {
                productionTaskId: visible,
                userId: user.id,
              },
            });
          } else {
            Toast.show({
              content: '请选择负责人！',
              position: 'bottom',
            });
          }

        } else {
          setVisible(false);
        }
      }}
      actions={[[{
        text: '取消',
        key: 'close',
      }, {
        text: '分派',
        key: 'dispatch',
      }]]}
    />
  </>;
};
export default ProductionTask;
