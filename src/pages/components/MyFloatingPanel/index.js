import React, { useEffect, useRef, useState } from 'react';
import { FloatingPanel } from 'antd-mobile';
import styles from './index.css';
import { ToolUtil } from '../ToolUtil';

const MyFloatingPanel = (
  {
    children,
    startHeight = window.innerHeight * 0.5,
    maxHeight = window.innerHeight - (ToolUtil.isQiyeWeixin() ? 0 : 45),
    backgroundDom,
    backgroundColor,
  }) => {

  const ref = useRef();

  const [anchors, setAnchors] = useState([startHeight, maxHeight]);

  useEffect(() => {
    if (document.getElementById('backgroundDom')) {
      const height = document.getElementById('backgroundDom').clientHeight;
      let minHeight = ToolUtil.isQiyeWeixin() ? window.innerHeight - height : window.innerHeight - height - 45;
      ref.current.setHeight(minHeight);
      const heights = [];
      for (let i = minHeight; i < maxHeight; i++) {
        heights.push(i);
      }
      setAnchors([minHeight, maxHeight,...heights]);
    }
  }, []);

  return <>
    <div id='backgroundDom' style={{maxHeight:'80vh',overflowY:'auto'}}>
      {backgroundDom}
    </div>
    <FloatingPanel
      ref={ref}
      className={!backgroundColor && styles.content}
      anchors={anchors}
    >
      {children}
    </FloatingPanel>
  </>;
};

export default MyFloatingPanel;
