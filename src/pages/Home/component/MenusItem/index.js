import React, { useState } from 'react';
import Menus from '../Menus';
import CreateInStock from '../../../Work/ProcessTask/Create/components/CreateInStock';
import Inventory from '../../../Work/ProcessTask/Create/components/Inventory';

const MenusItem = (
  {
    disabled,
    code,
    name,
    fontSize,
    textOverflow,
  },
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
          case 'inventoryAsk':
          case 'curingAsk':
            setVisible(code);
            return true;
          default:
            break;
        }
      }}
    />

    <Inventory open={visible === 'inventoryAsk'} onClose={() => setVisible(false)} />

  </>;
};

export default MenusItem;
