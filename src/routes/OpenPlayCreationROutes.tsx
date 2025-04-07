import { RouteObject } from 'react-router-dom';
import OpenPlayListWithModal from '../pages/club-openplay/OpenPlayListWithModal';



const OpenPlayCreationRoutes: RouteObject[] = [
  {
    path: 'open-play',
    element: <OpenPlayListWithModal />,
  },
];

export default OpenPlayCreationRoutes;