## Simple Drag and Drop Library


## Install


```bash
  yarn add @karkipy/dnd
```


## Usage

```javascript

function App() {
  const [items, setItems] = React.useState([1, 2, 3, 4, 5]);
  return (
    <div className="container">
      <DragDrop items={items} setItems={setItems} renderItem={(i) => {
        return <div> {i}</div>
      }} />
    </div>
  );
}
```