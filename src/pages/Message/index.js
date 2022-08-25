import React, { useRef, useState } from 'react';
import MyList from '../components/MyList';
import { useHistory } from 'react-router-dom';
import { ToolUtil } from '../components/ToolUtil';
import { DeleteOutline, RightOutline, ScanningOutline } from 'antd-mobile-icons';
import style from './index.less';
import { Avatar, Badge, Button, Popover, SwipeAction } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import KeepAlive from '../../components/KeepAlive';
import { AlignLeftOutlined, CloseCircleOutlined, PushpinOutlined } from '@ant-design/icons';
import { Message as MyMessage } from '../components/Message';

export const messageList = { url: '/message/list', method: 'POST' };
export const messageEdit = { url: '/message/edit', method: 'POST' };
export const messageDelete = { url: '/message/delete', method: 'POST' };

const MessageList = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const { run: edit } = useRequest(messageEdit, { manual: true });
  const { run: deleteRun } = useRequest(messageDelete, { manual: true });

  const [scrollTop, setScrollTop] = useState(0);

  const [params, setParams] = useState({});

  const listRef = useRef();

  const submit = (newParams) => {
    setParams({ ...params, ...newParams });
    listRef.current.submit({ ...params, ...newParams });
  };

  const actions = [
    { key: 'delete', icon: <DeleteOutline />, text: '删除全部已读' },
    { key: 'view', icon: <PushpinOutlined />, text: '全部标记已读' },
  ];

  const messageChange = (param = {}, item, index, del) => {
    let newData;
    if (del) {
      deleteRun({ data: { messageId: item.messageId } });
      newData = data.filter((item, clickIndex) => clickIndex !== index);
    } else {
      edit({ data: { messageId: item.messageId, ...param } });
      newData = data.map((item, clickIndex) => {
        if (clickIndex === index) {
          return { ...item, ...param };
        }
        return item;
      });
    }

    setData(newData);
  };

  return <div
    style={{
      scrollMarginTop: scrollTop,
      height: '100%',
      overflow: 'auto',
    }}
    id='content'
    onScroll={(event) => {
      setScrollTop(event.target.scrollTop);
    }}
  >
    <div className={style.screen}>
      <div className={style.status}>
        <Button color={params.view === 1 ? 'primary' : 'default'} onClick={() => submit({ view: 1 })}>查看已读</Button>
        <Button color={params.view === 0 ? 'primary' : 'default'} onClick={() => submit({ view: 0 })}>查看未读</Button>
      </div>
      <Popover.Menu
        actions={actions}
        placement='bottom-start'
        onAction={node => {
          if (node.key === 'delete') {
            MyMessage.warningDialog({
              content: '是否删除全部已读？',
              onConfirm: () => {

              },
              only: false,
            });
          } else {

          }
        }}
        trigger='click'
      >
        <AlignLeftOutlined />
      </Popover.Menu>
    </div>
    <div>
      <MyList ref={listRef} data={data} getData={setData} api={messageList}>
        {
          data.map((item, index) => {
            const rightActions = [
              {
                key: '0',
                text: item.view === 0 ? '标为已读' : '标为未读',
                color: 'primary',
              },
              {
                key: '1',
                text: '置顶',
                color: 'warning',
              },
              {
                key: '2',
                text: '删除',
                color: 'danger',
              },
            ];
            return <SwipeAction
              key={index}
              rightActions={rightActions}
              onAction={(action) => {
                switch (action.key) {
                  case '0':
                    messageChange({ view: item.view === 0 ? 1 : 0 }, item, index);
                    break;
                  case '1':
                    break;
                  case '2':
                    MyMessage.warningDialog({
                      content: '您要删除此条消息吗？',
                      onConfirm: () => {
                        messageChange({}, item, index, true);
                      },
                      only: false,
                    });
                    break;
                }
              }}
            >
              <div className={ToolUtil.classNames(style.item, style.flexCenter)} key={index} onClick={() => {
                messageChange({ view: 1 }, item, index);
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
              }}>
                <div className={style.avatar}>
                  <Avatar
                    src={ToolUtil.isObject(item.user).avatar}
                    style={{ '--border-radius': '50%', '--size': '44px' }}
                  />
                </div>
                <div className={style.content}>
                  <div className={style.title}>
                    <Badge style={{ '--right': '-10px', '--top': '4px' }} content={item.view === 0 ? Badge.dot : null}>
                      {item.title}
                    </Badge>
                  </div>
                  <div className={style.fontColor}>
                    {item.content}
                  </div>
                </div>
                <div className={ToolUtil.classNames(style.flexCenter, style.fontColor)}>
                  {ToolUtil.timeDifference(item.time)}
                  <RightOutline style={{ marginLeft: 8 }} />
                </div>
              </div>
              <div className={style.border} />
            </SwipeAction>;
          })
        }
      </MyList>
    </div>
  </div>;
};

const Message = () => {
  return <KeepAlive id='message' contentId='content'>
    <MessageList />
  </KeepAlive>;
};

export default Message;
