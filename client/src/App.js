import React from 'react';
import { useRecoilValue } from 'recoil';
import { positionSelector } from './state';

const App = React.memo(() => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket Positions</h2>
       {/* Loop from 1 to 10 to create position slots */}
      {[...Array(10)].map((_, index) => (
        <Position key={index} index={index} />
      ))}
    </div>
  );
});

const positionStyle = {
  border: "1px solid #333",
  padding: "10px",
  margin: "15px",
};

const Position = React.memo(({ index }) => {
  const timestamp = useRecoilValue(positionSelector(index));
  return (
    <div style={{ ...positionStyle }}>
      {index + 1} - {timestamp || ""}
    </div>
  );
});


export default App;
