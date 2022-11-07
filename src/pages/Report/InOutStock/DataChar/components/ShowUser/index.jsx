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
          {item.userResult?.name}
          <span style={{float:'right'}}>× {item.number || 0}</span>
        </div>
      </div>;
    })}
  </div>;
};

export default ShowUser;
