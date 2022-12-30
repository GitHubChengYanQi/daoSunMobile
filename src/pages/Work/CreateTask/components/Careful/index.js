import React, { useState } from 'react';
import style from '../../../Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import { MyLoading } from '../../../../components/MyLoading';
import { Dialog, Divider, Input, Selector, Toast } from 'antd-mobile';
import { ToolUtil } from '../../../../../util/ToolUtil';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useRequest } from '../../../../../util/Request';
import {
  announcementsAdd,
  announcementsDelete,
  announcementsEdit,
  announcementsListSelect,
} from '../../../Instock/Url';
import { useBoolean } from 'ahooks';
import FocusInput from './components/FocusInput';
import MyActionSheet from '../../../../components/MyActionSheet';
import { Message } from '../../../../components/Message';

const Careful = (
  {
    show,
    type,
    value = [],
    onChange = () => {
    },
    className,
  }) => {

  const [visible, setVisible] = useState(false);

  const [editVisible, setEditVisible] = useState();

  const [name, setName] = useState();

  const { loading: listLoading, data: announcemens, refresh } = useRequest({
    ...announcementsListSelect,
    data: { type },
  }, {
    onSuccess: () => {

    },
  });

  const { loading: deleteLoading, run: deleteRun } = useRequest(announcementsDelete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('删除成功!');
      onChange(value.filter(id => id !== visible));
      setVisible(false);
      refresh();
    },
  });

  const { loading: editLoading, run: editRun } = useRequest(announcementsEdit, {
    manual: true,
    onSuccess: () => {
      Message.successToast('修改成功!');
      setEditVisible(false);
      refresh();
    },
  });

  const { loading: addLoading, run: add } = useRequest(announcementsAdd, {
    manual: true,
    onSuccess: (res) => {
      openAddOther();
      refresh();
      onChange([...value, res.noticeId]);
    },
  });

  const [allCareful, { toggle: carefulToggle }] = useBoolean();

  const [addOther, { toggle: openAddOther }] = useBoolean();

  const [content, setContent] = useState('');

  const options = [...ToolUtil.isArray(announcemens).filter((item, index) => show ? value.includes(item.value) : (allCareful || index < 5))];

  if (!show) {
    options.push({
      label: '其他',
      value: 'other',
      className: 'aa',
    });
  }

  let timeOutId;

  return <>
    <div className={ToolUtil.classNames(style.carefulData, className)} id='careful'>
      {
        options.map((item, index) => {
          const checked = value.includes(item.value);
          return <div
            key={index}
            className={ToolUtil.classNames(style.carefulItem, checked && style.carefulChecked)}
            onTouchStart={() => {
              if (item.value === 'other') {
                return false;
              }
              timeOutId = setTimeout(() => {
                setVisible(item);
              }, 500);
              return false;
            }}
            onTouchEnd={() => {
              clearTimeout(timeOutId);
              if (visible) {
                return;
              }
              if (item.value === 'other') {
                setContent('');
                openAddOther();
                return;
              }
              onChange(checked ? value.filter(id => id !== item.value) : [...value, item.value]);
            }}
            onTouchMove={() => {

            }}
          >
            {item.label}
          </div>;
        })
      }
      {addOther && <div className={style.addCareful}>
        <FocusInput onChange={setContent} />
        <div className={style.actions}>
          <div className={style.closeButton} onClick={() => {
            openAddOther();
          }}>取消
          </div>
          <div className={style.split} />
          <div className={style.button} onClick={() => {
            if (content) {
              add({ data: { content, type } });
            } else {
              Toast.show({ content: '请输入事项名称！', position: 'bottom' });
            }
          }}>保存
          </div>
        </div>
      </div>}
    </div>
    {ToolUtil.isArray(announcemens).length > 6 && <Divider className={style.allSku}>
      <div onClick={() => {
        carefulToggle();
      }}>
        {
          allCareful ?
            <UpOutline />
            :
            <DownOutline />
        }
      </div>
    </Divider>}

    {(addLoading || listLoading) && <MyLoading />}

    <MyActionSheet
      onClose={() => setVisible(false)}
      visible={visible}
      actions={[
        { text: '修改', key: 'edit' },
        { text: '删除', key: 'delete', danger: true },
      ]}
      onAction={(action) => {
        if (action.key === 'edit') {
          setEditVisible(visible);
          setName(visible?.label);
          setVisible(false);
        } else {
          Message.warningDialog({
            only: false,
            content: '确定删除吗？',
            onConfirm: () => {
              return deleteRun({ data: { noticeId: visible?.value } });
            },
          });
        }
      }}
    />

    <Dialog
      visible={editVisible}
      onAction={(action) => {
        if (action.key === 'edit') {
          return editRun({ data: { noticeId: editVisible?.value, content: name } });
        } else {
          setEditVisible(false);
        }
      }}
      actions={[[
        { text: '取消', key: 'close' },
        { text: '修改', key: 'edit' },
      ]]}
      title='修改标签'
      content={<div className={style.updateName}>
        <Input value={name} onChange={setName} placeholder='请修改标签名称' />
      </div>}
    />
  </>;
};

export default Careful;
