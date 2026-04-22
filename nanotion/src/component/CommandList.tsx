import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const CommandList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = index => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-64 py-2">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2
              ${index === selectedIndex ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-gray-500">Nenhum comando encontrado</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
export default CommandList;