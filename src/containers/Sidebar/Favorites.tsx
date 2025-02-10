/* eslint-disable react/no-array-index-key */
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonUnstyled, Flex, FlexCenter, Icon, Paragraph, Text } from '@gilbarbara/components';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { resetUserData } from '~/store/actions';
import { selectUser } from '~/store/selectors';

interface LinkProps {
  onClickColor: () => void;
}

export default function Favorites({ onClickColor }: LinkProps) {
  const dispatch = useAppDispatch();

  const { colors } = useAppSelector(selectUser);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleClickResetFavorites = () => {
    if (confirmReset) {
      dispatch(resetUserData());

      return;
    }

    setConfirmReset(true);
    setTimeout(() => {
      setConfirmReset(false);
    }, 4000);
  };

  const content: Record<string, ReactNode> = {
    main: (
      <Flex color="gray" mt="xs">
        No favorites yet!
      </Flex>
    ),
  };

  if (colors.length) {
    content.reset = (
      <Flex mt="xs">
        <ButtonUnstyled onClick={handleClickResetFavorites} size="xs">
          {confirmReset ? (
            <Text color="red" size="xs">
              Are you sure?
            </Text>
          ) : (
            'Reset favorites'
          )}
        </ButtonUnstyled>
      </Flex>
    );
    content.main = (
      <Flex gap="xs" mt="md" wrap="wrap">
        {colors.map((d, index) => (
          <FlexCenter key={`${d}-${index}`} bg="white">
            <Link onClick={onClickColor} style={{ backgroundColor: d }} to={`/${d}`} />
          </FlexCenter>
        ))}
      </Flex>
    );
  }

  return (
    <div>
      <Paragraph bold size="lg">
        <Icon mr="xxs" name="heart" /> favorites
      </Paragraph>
      {content.main}
      {content.reset}
    </div>
  );
}
