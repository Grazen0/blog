import { createContext, useContext } from 'react';
import { SetState } from 'lib/types';

export const DarkModeContext = createContext<[boolean, SetState<boolean>]>([true, () => {}]);
DarkModeContext.displayName = 'Dark mode';

export const useDarkMode = () => useContext(DarkModeContext);
