import React, { useRef, useState } from 'react';
import {
  productionPickListsList,
  productionPickListsSelfList,
} from '../components/Url';
import { CapsuleTabs, Card, Checkbox, Space } from 'antd-mobile';
import { history } from 'umi';
import { QuestionCircleOutline } from 'antd-mobile-icons';
import MyNavBar from '../../../components/MyNavBar';
import MySearchBar from '../../../components/MySearchBar';
import MyList from '../../../components/MyList';
import styles from '../index.css';
import Label from '../../../components/Label';
import BottomButton from '../../../components/BottomButton';
import Icon from '../../../components/Icon';


const PickLists = (props) => {

  const params = props.location.query;

  const [data, setData] = useState([]);

  const [state, setState] = useState('0');

  const [merge, setMerge] = useState(false);

  const [ids, setIds] = useState([]);

  const ref = useRef();

  const status = (state) => {
    switch (state) {
      case 99:
        return <Space style={{ color: 'green' }}><QuestionCircleOutline />已完成</Space>;
      default:
        return <Space style={{ color: 'blue' }}><QuestionCircleOutline />执行中</Space>;
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
            extra={merge && <Checkbox
              checked={ids.includes(item.pickListsId)}
              icon={checked =>
                checked ? <Icon type='icon-duoxuanxuanzhong1' /> : <Icon type='icon-a-44-110' />
              }
            />}
            key={index}
            title={<Space align='start'>
              {status(item.status)}
            </Space>} className={styles.item}>
            <Space
              direction='vertical'
              onClick={() => {
                if (merge) {
                  if (ids.includes(item.pickListsId)) {
                    const array = ids.filter((idItem) => {
                      return idItem !== item.pickListsId;
                    });
                    setIds(array);
                  } else {
                    setIds([...ids, item.pickListsId]);
                  }
                } else if (params.type === 'all') {
                  history.push(`/Work/Production/PickDetail?ids=${item.pickListsId}`);
                } else {
                  history.push(`/Work/Production/Pick?id=${item.productionTaskResult && item.productionTaskResult.productionTaskId}`);
                }
              }}>
              <div>
                <Label>领料编码：</Label>{item.coding}
              </div>
              <div>
                <Label>领料人：</Label>{item.userResult && item.userResult.name}
              </div>
              <div>
                <Label>创建时间：</Label>{item.createTime}
              </div>
              <div>
                <Label>工序：</Label>
                {item.productionTaskResult
                  &&
                  item.productionTaskResult.shipSetpResult
                  &&
                  item.productionTaskResult.shipSetpResult.shipSetpName
                }
              </div>
            </Space>
          </Card>;
        })
      }
    </MyList>

    {params.type === 'all' && <BottomButton
      only={!merge}
      text='合并领料'
      color={merge ? 'primary' : 'default'}
      onClick={() => {
        setIds(data.map(item => item.pickListsId));
        setMerge(true);
      }}
      leftText='取消合并'
      leftOnClick={() => {
        setMerge(false);
      }}
      rightDisabled={ids.length === 0}
      rightText='合并领料'
      rightOnClick={() => {
        history.push(`/Work/Production/PickDetail?ids=${ids.join(',')}`);
      }}
    />}
  </>;
};

export default PickLists;
