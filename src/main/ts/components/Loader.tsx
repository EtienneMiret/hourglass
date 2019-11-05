import * as React from 'react';

export function Loader () {
  const divs = Array.from ({length: 12}, () => <div/>);
  return <div className="loader">{divs}</div>;
}
