import React from 'react';
import style from '../../../index.less';

const ShowUser = (
  {
    users = [],
    hidden,
  },
) => {

  if (hidden) {
    return <></>;
  }

  return <div className={style.otherContent}>
    {users.map((item, index) => {
      return <div
        key={index}
        className={style.skuSupply}
      >
        <div style={{padding:8}}>
          高东阳（生产制造部-操作工）
          <span style={{float:'right'}}>×3000</span>
        </div>
      </div>;
    })}
  </div>;
};

export default ShowUser;
