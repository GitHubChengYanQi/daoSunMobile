import React, { useRef, useState } from 'react';
import MySearchBar from '../../components/MySearchBar';
import MyList from '../../components/MyList';
import { productionTaskEdit, productionTaskList } from '../Production/components/Url';
import { Card, Dialog, Space, Toast } from 'antd-mobile';
import { history } from 'umi';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import styles from '../Production/index.css';
import Label from '../../components/Label';
import MyNavBar from '../../components/MyNavBar';
import LinkButton from '../../components/LinkButton';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from '../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../components/MyLoading';

const ProductionTask = (props) => {

  const [data, setData] = useState([]);

  const { loading, run } = useRequest(productionTaskEdit, {
    manual: true,
    onSuccess: (res) => {
      Toast.show({
        content: '领取成功！',
        position: 'bottom',
      });
      history.push(`/Work/ProductionTask/Detail?id=${res.productionTaskId}`);
    },
    onError: (err) => {
      Toast.show({
        content: '领取失败！',
        position: 'bottom',
      });
    },
  });

  const ref = useRef();

  if (loading) {
    return <MyLoading />;
  }

  const status = (state) => {
    switch (state) {
      case 0:
        return <Space style={{ color: '#ffa52a' }}><QuestionCircleOutline />待领取</Space>;
      case 1:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
      case 2:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return '';
    }
  };

  return <>
    <div style={{ position: 'sticky', top: 0, zIndex: 99 }}>
      <MyNavBar title='生产任务' />
      <MySearchBar extra onChange={(value) => {
        ref.current.submit({ coding: value });
      }} />
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
              } else {
                Dialog.confirm({
                  content: '是否领取此任务？',
                  onConfirm: async () => {
                    await run({
                      data: {
                        productionTaskId: item.productionTaskId,
                        userId: props.userInfo.id,
                      },
                    });
                  },
                });
              }
            }}
            key={index}
            title={<Space align='start'>
              {status(item.userId ? 1 : 0)}
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
export default connect(({ userInfo }) => ({ userInfo }))(ProductionTask);
