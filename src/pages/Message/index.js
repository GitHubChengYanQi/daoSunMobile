import React, { useState } from 'react';
import MyList from '../components/MyList';
import MyCard from '../components/MyCard';
import { useHistory } from 'react-router-dom';
import { ToolUtil } from '../components/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';
import style from './index.less';
import { Avatar } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import KeepAlive from '../../components/KeepAlive';

export const messageList = { url: '/message/list', method: 'POST' };
export const messageEdit = { url: '/message/edit', method: 'POST' };

const MessageList = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const { run: edit } = useRequest(messageEdit, { manual: true });

  const [scrollTop, setScrollTop] = useState(0);

  return <div
    id='content'
    style={{
      scrollMarginTop: scrollTop,
      height: '100%',
      overflow: 'auto',
    }}
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}>
    <MyList data={data} getData={setData} api={messageList}>
      {
        data.map((item, index) => {
          return <div className={style.flexCenter} key={index}>
            <div className={style.box}>
              <div hidden={item.view !== 0} className={style.badge} />
            </div>
            <div className={style.avatar}>
              <Avatar src={ToolUtil.isObject(item.user).avatar} style={{ '--border-radius': '50%' }} />
            </div>
            <MyCard
              className={style.card}
              bodyClassName={style.bodyStyle}
              titleBom={<div className={style.title}>{item.title}</div>}
              extra={<div className={ToolUtil.classNames(style.flexCenter, style.fontColor)}>
                {ToolUtil.timeDifference(item.time)}
                <RightOutline style={{ marginLeft: 8 }} />
              </div>}
              onClick={() => {
                edit({ data: { messageId: item.messageId, view: 1 } });
                const newData = data.map((item, clickIndex) => {
                  if (clickIndex === index) {
                    return { ...item, view: 1 };
                  }
                  return item;
                });
                setData(newData);
                switch (item.source) {
                  case 'instockOrder':
                  case 'instock':

                    break;
                  case 'outstockOrder':

                    break;
                  case 'productionTask':

                    break;
                  case 'selfPick':

                    break;
                  case 'processTask':
                    history.push(`Receipts/ReceiptsDetail?id=${item.sourceId}`);
                    break;
                  default:
                    break;
                }
              }}
              key={index}
            >
              <div
                className={ToolUtil.classNames(style.flexCenter, style.fontColor)}
              >
                {item.content}
              </div>
            </MyCard>
          </div>;
        })
      }
    </MyList>
  </div>;
};

const Message = () => {
  return <KeepAlive id='message' contentId='content'>
    <MessageList />
  </KeepAlive>;
};

export default Message;
