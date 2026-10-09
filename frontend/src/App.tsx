import { Toaster } from 'sonner';

import { Board } from '@/components/Board/Board';

import './App.scss';

export const App = () => {
  return (
    <div className="app">
      <Board />
      <Toaster position="bottom-right" richColors />
    </div>
  );
};
