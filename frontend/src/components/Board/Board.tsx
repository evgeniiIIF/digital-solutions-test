import { LeftPanel } from '@/components/Board/LeftPanel/LeftPanel';
import { RightPanel } from '@/components/Board/RightPanel/RightPanel';

import './Board.scss';

export const Board = () => {
  return (
    <div className="board">
      <div className="board__container">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
};
