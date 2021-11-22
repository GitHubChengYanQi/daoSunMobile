import React from 'react';

const getParentValue = (value, data) => {
  if (!Array.isArray(data)) {
    return [];
  }
  for (let i = 0; i < data.length; i++) {
    if (`${data[i].value}` === `${value}`) {
      return [{label: data[i].label, value: `${value}`}];
    }
    if (data[i].children.length > 0) {
      const values = getParentValue(value, data[i].children);
      if (values.length > 0) {
        return [{label: data[i].label, value: `${data[i].value}`}, ...values];
      }
    }
  }
  return [];
};

const TreeSelectSee = ({value,data}) => {

  const values = getParentValue(value, data || []);

  return (
    <>
      {values && values.map((items, index) => {
        if (items.value !== '0'){
          if (index === values.length -1 ){
            return <span key={index}>{items.label}</span>;
          }else {
            return <span key={index}>{items.label} -</span>;
          }
        }else {
          return null;
        }

      })}
    </>
  );

};

export default TreeSelectSee;
