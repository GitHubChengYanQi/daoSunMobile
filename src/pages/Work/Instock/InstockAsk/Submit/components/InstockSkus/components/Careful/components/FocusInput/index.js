import React, { useEffect, useRef } from 'react';
import style from '../../../../../PurchaseOrderInstock/index.less';
import { Input } from 'antd-mobile';

const FocusInput = (
  {
    onChange = () => {
    },
  },
) => {

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return <Input className={style.input} placeholder='请输入注意事项名称' onChange={onChange} ref={inputRef} />;
};

export default FocusInput;
