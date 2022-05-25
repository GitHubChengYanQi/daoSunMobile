import React, { useEffect, useState } from 'react';

const SplitDiv = ({ children = [], overflow, id }) => {

  const [topHeight, setTopHeight] = useState(0);


  useEffect(() => {
    const topHeight = document.getElementById(id);
    if (topHeight) {
      setTopHeight(topHeight.clientHeight);
    }
  }, []);


  return <div style={{ height: '100%' }}>
    <div id={id}>
      {children[0]}
    </div>
    <div style={{ height: `calc(100% - ${topHeight}px)`, overflow }}>
      {children[1]}
    </div>
  </div>;
};

export default SplitDiv;
