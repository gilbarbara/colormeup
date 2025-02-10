/* eslint-disable react/no-array-index-key */
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonUnstyled, Flex, FlexCenter, Icon, Paragraph } from '@gilbarbara/components';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { resetUserData, saveColor } from '~/store/actions';
import { selectUser } from '~/store/selectors';

interface FavoritesProps {
  hex: string;
  onClickColor: () => void;
}

export default function Favorites({ hex, onClickColor }: FavoritesProps) {
  const dispatch = useAppDispatch();

  const { colors } = useAppSelector(selectUser);
  const [confirmReset, setConfirmReset] = useState(false);
  const isFavorite = colors.includes(hex);

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

  const handleClickAddToFavorites = () => {
    dispatch(saveColor(hex));
  };

  const content: Record<string, ReactNode> = {
    main: (
      <Flex color="gray" mt="xs">
        No favorites yet!
      </Flex>
    ),
  };

  content.options = (
    <Flex direction="column" gap="xxs" mt="sm">
      <ButtonUnstyled
        color="white"
        disabled={isFavorite}
        onClick={handleClickAddToFavorites}
        size="xs"
      >
        <Icon mr="xxs" name="heart" />
        Add to favorites
      </ButtonUnstyled>
      {!!colors.length && (
        <ButtonUnstyled
          color={confirmReset ? 'red' : undefined}
          onClick={handleClickResetFavorites}
          size="xs"
        >
          {confirmReset ? (
            <>
              <Icon mr="xxs" name="check" />
              Are you sure?
            </>
          ) : (
            <>
              <Icon mr="xxs" name="trash" />
              Erase favorites
            </>
          )}
        </ButtonUnstyled>
      )}
    </Flex>
  );

  if (colors.length) {
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
      {content.options}
    </div>
  );
}
