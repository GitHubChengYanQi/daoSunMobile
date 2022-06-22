import React, { useState } from 'react';
import Menus from '../Menus';
import CreateInStock from '../../../Work/ProcessTask/Create/components/CreateInStock';

const MenusItem = (
  {
    disabled,
    code,
    name,
    fontSize,
    textOverflow,
  }
) => {

  const [visible, setVisible] = useState();

  return <>

    <Menus
      textOverflow={textOverflow}
      code={code}
      name={name}
      disabled={disabled}
      fontSize={fontSize}
      onClick={(code) => {
        switch (code) {
          case 'instockAsk':
            setVisible(code);
            return true;
          default:
            break;
        }
      }}
    />

    <CreateInStock open={visible === 'instockAsk'} onClose={() => setVisible(false)} />

  </>
};

export default MenusItem;
