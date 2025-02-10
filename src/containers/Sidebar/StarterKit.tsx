import { Link } from 'react-router-dom';
import { Box, ButtonUnstyled, Flex, FlexCenter, Icon, Paragraph } from '@gilbarbara/components';

import { colors } from '~/config';
import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { setUserOptions } from '~/store/actions';
import { selectUser } from '~/store/selectors';

interface LinkProps {
  onClickColor: () => void;
}

export default function StarterKit({ onClickColor }: LinkProps) {
  const dispatch = useAppDispatch();
  const { showStarterKit } = useAppSelector(selectUser);

  const handleClickHideStarter = () => {
    dispatch(setUserOptions({ showStarterKit: !showStarterKit }));
  };

  if (!showStarterKit) {
    return null;
  }

  return (
    <Box>
      <Paragraph bold size="lg">
        <Icon name="flash" /> starter kit
      </Paragraph>
      <Flex gap="xs" mb="xs" mt="md" wrap="wrap">
        {colors.map(d => (
          <FlexCenter key={d} bg="white">
            <Link key={d} onClick={onClickColor} style={{ backgroundColor: d }} to={`/${d}`} />
          </FlexCenter>
        ))}
      </Flex>
      <ButtonUnstyled onClick={handleClickHideStarter} size="xs">
        Hide starter kit
      </ButtonUnstyled>
    </Box>
  );
}
