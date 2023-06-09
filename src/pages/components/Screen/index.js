import React, { useRef, useState } from 'react';
import style from './index.less';
import { Button, Popup, SideBar } from 'antd-mobile';
import { useThrottleFn } from 'ahooks';
import { ToolUtil } from '../../../util/ToolUtil';
import MyEllipsis from '../MyEllipsis';

const Screen = (
  {
    screen,
    position,
    buttonTitle,
    onClose = () => {
    },
    onClear = () => {
    },
    searchtype,
    searchtypeScreened = () => {
    },
    screenContent = () => {
    },
    SideBarDisabled = () => {
    },
    afterClose = () => {
    },
    height,
    className,
    fill,
    noNavBar,
    noSpace,
  }) => {

  const [activeKey, setActiveKey] = useState();

  const [checked, setChecked] = useState();

  const { run: handleScroll } = useThrottleFn(
    () => {
      if (checked) {
        return;
      }
      let currentKey = searchtype[0].key;
      for (const item of searchtype) {
        const element = document.getElementById(item.key);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= 90) {
          currentKey = item.key;
        } else {
          break;
        }
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    },
  );

  const mainElementRef = useRef(null);

  return <>
    <Popup
      getContainer={null}
      forceRender
      afterShow={() => {
        const mainElement = mainElementRef.current;
        if (!mainElement) return;
        mainElement.addEventListener('scroll', handleScroll);
      }}
      afterClose={() => {
        afterClose();
        const mainElement = mainElementRef.current;
        if (!mainElement) return;
        mainElement.removeEventListener('scroll', handleScroll);
      }}
      className={ToolUtil.classNames(style.popup, ToolUtil.isQiyeWeixin() ? style.qywx : style.other, className)}
      visible={screen}
      onMaskClick={() => {
        onClose();
      }}
      position={position || 'top'}
      bodyStyle={{ height: '40vh' }}
    >
      <div className={style.screenDiv} style={{ top: (noNavBar || ToolUtil.isQiyeWeixin()) ? 0 : 40 }}>
        <div
          className={style.top}
          style={{ height: height || ((noNavBar || ToolUtil.isQiyeWeixin()) ? 40 : 85) }}
          onClick={onClose}
        />
        <div hidden={noSpace} className={style.space} />
        <div className={style.content}>
          <SideBar
            className={style.sideBar}
            activeKey={activeKey}
            onChange={key => {
              setChecked(true);
              if (document.getElementById(key)) {
                document.getElementById(key).scrollIntoView();
              }
              setActiveKey(key);
              setTimeout(() => {
                setChecked(false);
              }, 1000);
            }}
          >
            {searchtype.map(item => {

              const { screened, overLength } = searchtypeScreened(item.key);

              return <SideBar.Item
                disabled={SideBarDisabled(item.key, screened, overLength)}
                key={item.key}
                title={<div className={style.sideBarTitle}>
                  {screened && <div className={style.screened} />}
                  <MyEllipsis width='calc(20vw - 20px)'>{item.title}</MyEllipsis>
                </div>}
              />;
            })}
          </SideBar>
          <div className={style.screenContent} ref={mainElementRef} id='screenContent'>
            {
              searchtype.map((item, idnex) => {
                return <div id={item.key} key={idnex}>
                  {screenContent(item)}
                </div>;
              })
            }
            <div style={{ height: '100%' }} />
          </div>
        </div>
        <div className={style.buttons}>
          <Button
            className={ToolUtil.classNames(style.close, style.button)}
            color='primary'
            fill='outline'
            onClick={() => {
              onClear();
            }}>
            重置
          </Button>
          <Button
            className={ToolUtil.classNames(style.ok, style.button)}
            color='primary'
            fill={fill}
            onClick={() => {
              onClose();
            }}>
            {buttonTitle}
          </Button>
        </div>
      </div>
    </Popup>
  </>;
};

export default Screen;
