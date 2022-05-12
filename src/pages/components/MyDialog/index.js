import React, { useImperativeHandle, useState } from 'react';
import { Dialog } from 'antd-mobile';
import style from './index.less';

const MyDialog = ({ ...porps }, ref) => {

  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState();

  const open = (title) => {
    setTitle(title);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  return <Dialog
    className={style.dialog}
    visible={visible}
    content={
      <div className={style.title}>
        {title}
      </div>
    }
    onAction={() => {
      setVisible(false);
    }}
    actions={[[{
      text: <div className={style.button}>确定</div>,
      key: 'ok',
    }]]}
  />;
};

export default React.forwardRef(MyDialog);
