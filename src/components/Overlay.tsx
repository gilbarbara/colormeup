import { Box } from '@gilbarbara/components';

import { useAppDispatch } from '~/modules/hooks';
import { toggleSidebar } from '~/store/actions';

import { UIOptions } from '~/types';

export default function Overlay({ isSidebarOpen }: UIOptions) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box
      bg="black"
      bottom={0}
      data-component-name="Overlay"
      display={isSidebarOpen ? 'block' : 'none'}
      left={0}
      onClick={handleClick}
      opacity={0.4}
      position="absolute"
      right={0}
      top={0}
      zIndex={5}
    />
  );
}
