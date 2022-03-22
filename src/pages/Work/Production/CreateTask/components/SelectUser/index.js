import React, { useState } from 'react';
import { Button, Card, Divider, Input, Loading, Popover, Space } from 'antd-mobile';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from '../../../../../../util/Request';
import { UserIdSelect } from '../../../../Quality/Url';

const SelectUser = ({ value, onChange }) => {

  const [visible, setVisible] = useState(false);

  const { loading, data, run } = useRequest(UserIdSelect);

  const showUser = (name) => {
    return <Space align='center'>
      <Avatar size={24}> <span style={{ fontSize: 14 }}>{name.substring(0, 1)}</span></Avatar>{name}
    </Space>;
  };

  const showDefault = () => {
    return <Space align='center'>
      <Avatar size={24}> <span style={{ fontSize: 14 }}><UserOutlined /></span></Avatar>待认领
    </Space>;
  };

  const content = () => {

    return <>
      <Input style={{ border: 'solid 1px #eee', padding: 4 }} onChange={(value) => {
        run({
          data: { name: value },
        });
      }} />
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        <Card title='执行者'>
          {value ? showUser(value.name) : showDefault()}
        </Card>
        <Card title='所有人'>
          {value && <div onClick={() => {
            onChange(null);
            setVisible(false);
          }}>{showDefault()}
            <Divider style={{ margin: 8 }} />
          </div>}
          {
            loading
              ?
              <Loading />
              :
              data && data.map((item, index) => {
                if (value && (item.value === value.id)) {
                  return null;
                }
                return <div key={index} onClick={() => {
                  onChange({ name: item.label, id: item.value });
                  setVisible(false);
                }}>
                  {showUser(item.label)}
                  <Divider style={{ margin: 8 }} />
                </div>;
              })
          }
        </Card>

      </div>
    </>;
  };

  return <>
    <Popover
      content={content()}
      trigger='click'
      destroyOnHide
      placement='bottom'
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button style={{ padding: 0 }} fill='none' onClick={() => {
        run();
        setVisible(true);
      }}>
        {value ? showUser(value.name) : showDefault()}
      </Button>
    </Popover>
  </>;
};

export default SelectUser;
