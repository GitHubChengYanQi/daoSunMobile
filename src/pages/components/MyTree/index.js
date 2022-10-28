import React, { useState } from 'react';
import { Card, Popup } from 'antd-mobile';
import { Tree } from 'antd';
import LinkButton from '../LinkButton';
import { CloseOutline } from 'antd-mobile-icons';

const MyTree = (
  {
    options,
    onNode = () => {
    },
    onChange = () => {
    },
    value,
    title,
    children,
  }) => {

  const [visible, setVisible] = useState();

  return <>
    <div onClick={() => {
      setVisible(true);
    }}>
      {children || '选择'}
    </div>

     <Popup
      getContainer={null}
      visible={visible}
      destroyOnClose
      onMaskClick={() => {
        setVisible(false);
      }}
      position='bottom'
    >
      <Card
        style={{ height:'50vh',overflow:'auto' }}
        title={title || '选择'}
        headerStyle={{position:'sticky',top:0,backgroundColor:'#fff',zIndex:99}}
        extra={<LinkButton title={<CloseOutline />} onClick={() => {
          setVisible(false);
        }} />}
      >
        <Tree
          defaultExpandAll
          defaultExpandedKeys={[value]}
          selectedKeys={[value]}
          onSelect={(selected, info) => {
            onChange(selected[0]);
            onNode(info.node);
          }}
          treeData={options || []}
        />
      </Card>
    </Popup>
  </>;
};

export default MyTree;
