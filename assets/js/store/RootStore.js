import React, {FC, createContext, useContext} from 'react';
import {PartnerStore} from './PartnerStore';

export class RootStore {
  partnerStore;
  constructor() {
    this.partnerStore = new PartnerStore(this);
  }
}

const store = new RootStore();

export const StoreContext = createContext(store);

export const StoreProvider = ({children}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
export default useStore;
