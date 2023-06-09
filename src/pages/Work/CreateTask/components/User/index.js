import React, { useRef } from 'react';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import CheckUser from '../../../../components/CheckUser';
import { UserAddOutline } from 'antd-mobile-icons';
import Title from '../../../../components/Title';
import MyCard from '../../../../components/MyCard';
import { UserName } from '../../../../components/User';
import LinkButton from '../../../../components/LinkButton';

const User = (
  {
    value = [],
    multiple,
    title,
    onChange = () => {
    },
    noRequired,
    show,
  },
) => {

  const userRef = useRef();

  return <>
    <MyCard
      titleBom={<Title className={style.title}>{title}<span hidden={noRequired}>*</span></Title>}
      extra={!multiple && <div className={style.alignCenter} onClick={() => {
        !show && userRef.current.open();
      }}>
        {value.length > 0 ?
          <div className={style.alignCenter}>
            <UserName user={value[0]} />
          </div>
          :
          <LinkButton>
            <UserAddOutline
              className={style.addUserIcon} />
          </LinkButton>
        }
      </div>}
    >
      {multiple && <div className={style.multiple}>
        {
          value.map((item, index) => {
            return <div className={style.user} key={index}>
              <UserName user={item} />
            </div>;
          })
        }
        <LinkButton
          onClick={() => !show && userRef.current.open()}>
          <UserAddOutline
            className={style.addUserIcon}
          />
        </LinkButton>
      </div>}
    </MyCard>

    <CheckUser multiple={multiple} ref={userRef} value={value} onChange={onChange} />
  </>;
};

export default User;
