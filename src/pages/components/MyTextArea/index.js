import React, { useEffect, useRef, useState } from 'react';
import { ToolUtil } from '../ToolUtil';
import CheckUser from '../CheckUser';
import { Input } from 'antd';
import style from './index.less';

const MyTextArea = (
  {
    className,
    placeholder,
    onChange = (value,users) => {

    },
    value = '',
    id = 'textArea',
    autoFocus,
    onFocus = () => {

    },
  },
) => {

  const userRef = useRef();


  const [userPos, setUserPos] = useState([]);

  const [cursor, setCursor] = useState(0);

  const valueChange = (string, array = [], pos) => {
    onChange(string, array.map(item => {
      return {
        userId: item.userId,
        name: item.userName,
      };
    }));

    if (pos) {
      setTimeout(() => {
        setCaretPosition(pos);
      }, 0);
    }
  };

  const getCursortPosition = () => {//获取光标位置函数
    const textArea = document.getElementById(id);
    if (!textArea) {
      return;
    }
    let CaretPos = 0;	// IE Support
    if (document.selection) {
      textArea.focus();
      var Sel = document.selection.createRange();
      Sel.moveStart('character', -textArea.value.length);
      CaretPos = Sel.text.length;
    }
    // Firefox support
    else if (textArea.selectionStart || textArea.selectionStart === '0')
      CaretPos = textArea.selectionStart;
    return (CaretPos);
  };

  const setCaretPosition = (pos) => {//设置光标位置函数
    const textArea = document.getElementById(id);
    if (!textArea) {
      return;
    }
    if (textArea.setSelectionRange) {
      textArea.focus();
      textArea.setSelectionRange(pos, pos);
    } else if (textArea.createTextRange) {
      var range = textArea.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

  const clickUser = (del) => {
    const currentPos = getCursortPosition();
    const clickUsers = userPos.filter(item => {
      if (del) {
        return item.start < currentPos && currentPos < item.end;
      }
      return item.start <= currentPos && currentPos < item.end;
    });
    return clickUsers[0];
  };

  const userPosChange = (length, userPos, cursorPos = cursor) => {
    const newUserPos = userPos.map(item => {
      if (cursorPos < item.start) {
        return { ...item, start: item.start + length, end: item.end + length };
      } else {
        return item;
      }
    });
    setUserPos(newUserPos);
  };

  useEffect(() => {
    if (autoFocus) {
      const textArea = document.getElementById(id);
      if (textArea) {
        textArea.focus();
      }
    }
  }, []);

  return <>
    <Input.TextArea
      id={id}
      autoSize
      value={value}
      style={{ userSelect: 'none' }}
      onFocus={onFocus}
      onSelect={() => {
        if (clickUser()) {
          setCaretPosition(cursor);
        } else {
          setCursor(getCursortPosition());
        }
      }}
      className={ToolUtil.classNames(style.text, className)}
      placeholder={placeholder || '可@相关人员'}
      onChange={(textArea) => {
        const currentValue = textArea.nativeEvent.data;
        const textAreaValue = textArea.target.value;

        if (currentValue === null) {
          const clickUserPos = clickUser(true);
          if (clickUserPos) {
            const newUserPos = userPos.filter(item => !(item.start === clickUserPos.start && item.end === clickUserPos.end));
            const values = value.split('');
            const newValue = values.filter((item, index) => !(index + 1 >= clickUserPos.start && index < clickUserPos.end));
            valueChange(newValue.join(''), newUserPos);
            setCaretPosition(clickUserPos.start);
            userPosChange(clickUserPos.start - 1 - clickUserPos.end, newUserPos);
          } else {
            const newUserPos = userPos.filter(item => ToolUtil.queryString(item.content, textAreaValue));
            setUserPos(newUserPos);
            valueChange(textAreaValue, newUserPos);
          }
        } else {
          const currentValueLength = textAreaValue.length - value.length;
          userPosChange(currentValueLength, userPos);
          if (currentValue === '@') {
            const textArea = document.getElementById(id);
            if (textArea) {
              textArea.blur();
            }
            userRef.current.open();
          }
          valueChange(textAreaValue, userPos);
        }

      }}
    />

    <CheckUser
      onClose={() => {
        setCaretPosition(cursor + 1);
      }}
      ref={userRef}
      onChange={(userId, userName) => {
        const caretPos = getCursortPosition();
        const newPos = caretPos + userName.length + 1;
        const values = value.split('');
        values.splice(caretPos, 0, userName + ' ');
        const newValue = values.join('');
        const newUserPos = [...userPos, {
          start: caretPos,
          end: newPos,
          content: '@' + userName + ' ',
          userId,
          userName,
        }];
        userPosChange(newPos - caretPos, newUserPos, caretPos);
        valueChange(newValue, newUserPos, newPos);
      }} />
  </>;
};

export default MyTextArea;
