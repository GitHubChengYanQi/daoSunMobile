import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Divider, Popup, Selector } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { UserIdSelect } from '../../Work/Customer/CustomerUrl';
import Cascader from '../Cascader';
import BottomButton from '../BottomButton';
import { Spin } from 'antd';

const SelectUsers = ({ value, onChange, multiple }, ref) => {

  const [visible, setVisible] = useState(false);

  const [deptId, setDeptId] = useState();

  const [user, setUser] = useState([]);

  const { loading, data, run } = useRequest(UserIdSelect, { manual: true });

  useEffect(() => {
    if (visible) {
      run({});
      setUser([]);
      onChange([]);
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    setVisible,
  }));

  return <>
    <Popup
      visible={visible}
      position='bottom'
      bodyStyle={{ height: '100vh' }}
    >
      <div style={{ padding: 16 }}>
        <Cascader
          placeholder='选择部门搜索'
          width='100%'
          value={deptId}
          api={
            {
              url: '/rest/dept/tree',
              method: 'POST',
            }
          }
          onChange={async (value) => {
            setDeptId(value);
            await run({
              data: {
                deptId: value,
              },
            });
          }} />
        <Divider />
        <div style={{ height: '90vh', overflowY: 'auto', textAlign: 'center' }}>
          {loading ? <Spin style={{ padding: 16 }} /> :
            <Selector
              value={user.map((items) => {
                return items.value;
              })}
              columns={1}
              options={data || []}
              multiple={multiple}
              onChange={(arr, extend) => {
                setUser(extend.items);
              }}
            />
          }
          {loading ? <Spin style={{ padding: 16 }} /> :
            <Selector
              value={value && value.map((items) => {
                return items.value;
              })}
              columns={1}
              options={data || []}
              multiple={multiple}
              onChange={(arr, extend) => {
                setUser(extend.items);
              }}
            />
          }
        </div>
      </div>
      <BottomButton
        leftOnClick={() => {
          setVisible(false);
        }}
        rightOnClick={() => {
          typeof onChange === 'function' && onChange(user.map(item => {
            return { userId: item.value, name: item.label };
          }));
          setVisible(false);
        }}
      />
    </Popup>
  </>;
};

export default React.forwardRef(SelectUsers);
