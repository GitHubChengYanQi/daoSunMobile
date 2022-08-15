import React from 'react';
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

  return <>

    <Menus
      textOverflow={textOverflow}
      code={code}
      name={name}
      disabled={disabled}
      fontSize={fontSize}
    />

  </>;
};

export default MenusItem;
