import React from 'react';
import style from './index.less';
import { MoreOutline } from 'antd-mobile-icons';
import { Button } from 'antd-mobile';

const Bottom = () => {


  return <div className={style.bottom}>
    <div className={style.all}>
      更多
      <MoreOutline style={{fontSize:15}} />
    </div>
    <div className={style.buttons}>
      <Button color='primary' fill='none'>
        驳回
      </Button>
      <Button color='primary'>
        同意
      </Button>
    </div>
  </div>;
};

export default Bottom;
