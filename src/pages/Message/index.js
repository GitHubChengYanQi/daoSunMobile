import React, { useRef, useState } from 'react';
import MyList from '../components/MyList';
import { useHistory } from 'react-router-dom';
import { ToolUtil } from '../components/ToolUtil';
import { DeleteOutline, RightOutline } from 'antd-mobile-icons';
import style from './index.less';
import { Avatar, Badge, Button, Popover, SwipeAction, Tabs } from 'antd-mobile';
import { useRequest } from '../../util/Request';
import KeepAlive from '../../components/KeepAlive';
import { AlignLeftOutlined, PushpinOutlined } from '@ant-design/icons';
import { Message as MyMessage } from '../components/Message';
import { MyLoading } from '../components/MyLoading';
import MyNavBar from '../components/MyNavBar';
import MySearch from '../components/MySearch';

export const messageList = { url: '/message/list', method: 'POST' };
export const messageEdit = { url: '/message/edit', method: 'POST' };
export const messageDelete = { url: '/message/delete', method: 'POST' };
export const messageTop = { url: '/message/top', method: 'GET' };
export const messageCancelTop = { url: '/message/cancelTop', method: 'GET' };
export const allRead = { url: '/message/allRead', method: 'GET' };
export const removeAllRead = { url: '/message/removeAllRead', method: 'GET' };

const MessageList = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const [params, setParams] = useState({ view: null });

  const listRef = useRef();

  const submit = (newParams) => {
    setParams({ ...params, ...newParams });
    listRef.current.submit({ ...params, ...newParams });
  };


  const { run: edit } = useRequest(messageEdit, { manual: true });
  const { loading: allReadLoading, run: allReadRun } = useRequest(allRead, { manual: true, onSuccess: () => submit() });
  const { loading: removeAllReadLoading, run: removeAllReadRun } = useRequest(removeAllRead, {
    manual: true,
    onSuccess: () => submit(),
  });
  const { run: deleteRun } = useRequest(messageDelete, { manual: true });
  const { loading: topLoading, run: top } = useRequest(messageTop, { manual: true, onSuccess: () => submit() });
  const { loading: cancelTopLoading, run: cancelTop } = useRequest(messageCancelTop, {
    manual: true,
    onSuccess: () => submit(),
  });

  const [scrollTop, setScrollTop] = useState(0);

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
    <MyNavBar title='消息列表' noDom />
    <MySearch placeholder='搜索' />
    <div className={style.screen}>
      <Tabs
        className={style.tabs}
        stretch={false}
        activeKey={params.view || '99'}
        onChange={(key) => {
          submit({ view: key === '99' ? null : key });
        }}
      >
        <Tabs.Tab title='全部' key='99' />
        <Tabs.Tab title='已读' key='1' />
        <Tabs.Tab title='未读' key='0' />
      </Tabs>
      <Popover.Menu
        actions={actions}
        placement='bottom-start'
        onAction={node => {
          if (node.key === 'delete') {
            MyMessage.warningDialog({
              content: '是否删除全部已读？',
              onConfirm: () => {
                removeAllReadRun();
              },
              only: false,
            });
          } else {
            allReadRun();
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
                text: item.sort === 0 ? '置顶' : '取消置顶',
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
              style={{
                '--background': 'transparent',
              }}
              rightActions={rightActions}
              onAction={(action) => {
                switch (action.key) {
                  case '0':
                    messageChange({ view: item.view === 0 ? 1 : 0 }, item, index);
                    break;
                  case '1':
                    item.sort === 0 ? top({ params: { messageId: item.messageId } }) : cancelTop({ params: { messageId: item.messageId } });
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
              <div
                className={ToolUtil.classNames(style.item, item.sort !== 0 && style.top)}
                key={index}
                onClick={() => {
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
                <div className={style.title}>
                  <Avatar
                    src={ToolUtil.isObject(item.user).avatar}
                    style={{ '--border-radius': '50%', '--size': '24px' }}
                  />
                  <div className={style.titleBadge}>
                    <Badge
                      wrapperClassName={style.badge}
                      style={{ '--right': '-10px', '--top': '4px' }}
                      content={item.view === 0 ? Badge.dot : null}
                    >
                      {item.title}
                    </Badge>
                    <RightOutline style={{ marginLeft: 16,color:'#D8D8D8' }} />
                  </div>
                  <div className={ToolUtil.classNames(style.flexCenter, style.fontColor, style.time)}>
                    {ToolUtil.timeDifference(item.time)}
                  </div>
                </div>
                <div className={style.theme} hidden={!item.processTaskResult?.theme}>
                  {item.processTaskResult?.theme}
                </div>
                <div className={style.content} hidden={!item.content}>
                  {item.content}
                </div>
              </div>
              <div className={style.border} />
            </SwipeAction>;
          })
        }
      </MyList>
    </div>

    {(allReadLoading || removeAllReadLoading || topLoading || cancelTopLoading) && <MyLoading />}
  </div>;
};

const Message = () => {
  return <KeepAlive id='message' contentId='content'>
    <MyNavBar title='消息' noDom />
    <MessageList />
  </KeepAlive>;
};

export default Message;
