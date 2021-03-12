import React, { FC, useState } from 'react';
import Drawer from './Drawer';
import TopAppBar from './TopAppBar';

export const Navigation = () => {
  const [showDrawer, setDrawer] = useState<boolean>(false)

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
         (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawer(open);
  };
  return (
    <>
      <TopAppBar toggleDrawer={toggleDrawer} isOpen={showDrawer}/>
      <Drawer toggleDrawer={toggleDrawer} open={showDrawer}/>
    </>
  )
}

export default Navigation;