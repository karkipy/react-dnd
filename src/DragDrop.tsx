import * as React from 'react';

class Draggable {
  fn: (list: any) => void;
  list: null | Array<HTMLLIElement>;
  draggedIndex: null | number;

  get itemList() {
    return this.list;
  }

  setDraggedIndex(idx: number) {
    this.draggedIndex = idx;
  }

  registerSetter(fn: (list: any) => void) {
    this.fn = fn;
  }


  updateList(draggedTo: number) {
    if (this.fn) {
      this.fn((prev: Array<any>) => {
        const draggedItem = prev[this.draggedIndex];
        const newArray = [...prev.slice(0, this.draggedIndex), ...prev.slice(this.draggedIndex + 1)];
        return [...newArray.slice(0, draggedTo),draggedItem, ...newArray.slice(draggedTo)]
      });
    }
  }

  registerList(list: Array<HTMLLIElement>) {
    if (!this.list) {
      this.list = list
    }
  }

  static create() {
    return new Draggable();
  }
}

const DragContext = React.createContext(Draggable.create());


function DropItem({ children, index }: { children: any, index: number}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const controller = React.useContext(DragContext);
  const handleDragStart = React.useCallback((e) => {
    // required for fireforx
    e.dataTransfer.effectAllowed = 'move';
    // @ts-ignore
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    const { target } = e;
    let dragged = target;
    controller.registerList(target.parentNode.children);
    let list = controller.itemList;
    for(let i = 0; i < list.length; i += 1) {
      if(list[i] === dragged){
        controller.setDraggedIndex(i);
      }
    }
  }, [index]);

  const handleDragEnd = React.useCallback((e) => {
    const list = controller.itemList;
    for(let i = 0; i < list.length; i += 1) {
      if(list[i] === ref.current){
        controller.updateList(i);
      }
    }
  }, [index])



  return (
    <li
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      {children}
    </li>
  )
}

function DragDrop({ items, renderItem, setItems }: { items: Array<any>, renderItem: (p: any) => void, setItems: (p: Array<any>) => void}) {
  const controller = React.useContext(DragContext);
  controller.registerSetter(setItems);
  return (
    <ul>
      {items.map((i, idx) => {
        return (
          <DropItem key={idx} index={idx}>
            {renderItem(i)}
          </DropItem>
        )
      })}
    </ul>
  );
}

export default DragDrop;
