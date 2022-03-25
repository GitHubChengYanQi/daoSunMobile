import React, { useEffect, useRef, useState } from 'react';
import { FloatingPanel } from 'antd-mobile';
import { getHeader } from '../GetHeader';
import styles from './index.css';

const MyFloatingPanel = (
  {
    children,
    startHeight = window.innerHeight * 0.5,
    maxHeight = window.innerHeight - (getHeader() ? 0 : 45),
    backgroundDom,
    backgroundColor,
  }) => {

  const ref = useRef();

  const [anchors, setAnchors] = useState([startHeight, maxHeight]);

  useEffect(() => {
    if (document.getElementById('backgroundDom')) {
      const height = document.getElementById('backgroundDom').clientHeight;
      const minHeight = getHeader() ? window.innerHeight - height : window.innerHeight - height - 45;
      ref.current.setHeight(minHeight);
      const heights = [];
      for (let i = minHeight; i < maxHeight; i++) {
        heights.push(i);
      }
      setAnchors([minHeight, maxHeight,...heights]);
    }
  }, []);

  return <>
    <div id='backgroundDom'>
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