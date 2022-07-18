import React, { useState } from 'react';
import Menus from '../Menus';

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
          case 'curingAsk':
            setVisible(code);
            return true;
          default:
            break;
        }
      }}
    />

  </>;
};

export default MenusItem;
