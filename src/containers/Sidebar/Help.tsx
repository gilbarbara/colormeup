import {
  Button,
  ButtonUnstyled,
  Flex,
  FlexInline,
  Icon,
  Paragraph,
  Text,
} from '@gilbarbara/components';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { setUserOptions } from '~/store/actions';
import { selectUser } from '~/store/selectors';

import styles from './Sidebar.module.css';

interface HelpProps {
  color: string;
}

export default function Help({ color }: HelpProps) {
  const dispatch = useAppDispatch();
  const { showHelp, showStarterKit } = useAppSelector(selectUser);

  const handleClickHelp = () => {
    dispatch(setUserOptions({ showHelp: !showHelp }));
  };

  const handleClickRestore = () => {
    dispatch(setUserOptions({ showStarterKit: true }));
  };

  return (
    <div className={styles.help}>
      <ButtonUnstyled onClick={handleClickHelp}>
        <Icon mr="xxs" name="info-o" />
        <Text bold size="lg">
          help
        </Text>
      </ButtonUnstyled>
      {showHelp && (
        <Flex direction="column" gap="md" mt="xs">
          <Paragraph bold color={color} size="xl">
            Know your colors!
          </Paragraph>
          <Paragraph>
            colormeup is a tool to inspect colors and play with its many variations in HSL or RGB.
          </Paragraph>
          <FlexInline align="center">
            <Icon mr="xs" name="layout-grid" />
            the number of colors
          </FlexInline>
          <FlexInline align="center">
            <Icon mr="xs" name="sync" />
            generate a new color
          </FlexInline>
          <FlexInline align="center">
            <Icon mr="xs" name="heart" /> save to your favorites
          </FlexInline>
          {!showStarterKit && (
            <Button bg="white" onClick={handleClickRestore} size="xs" variant="bordered">
              <Icon name="eye" />
              Show starter kit
            </Button>
          )}
        </Flex>
      )}
    </div>
  );
}
