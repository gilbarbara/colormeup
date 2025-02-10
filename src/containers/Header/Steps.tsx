import { Flex, Icon } from '@gilbarbara/components';

import { isNumber } from '~/modules/helpers';
import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { setOptions } from '~/store/actions';
import { selectColor } from '~/store/selectors';

import NumericInput from '~/components/NumericInput';

export default function HeaderSteps() {
  const dispatch = useAppDispatch();
  const { steps } = useAppSelector(selectColor);

  const handleChangeSteps = (data: any) => {
    if (isNumber(data.value) && data.value > 0) {
      dispatch(setOptions({ [data.name]: data.value }));
    }
  };

  return (
    <Flex align="center" bg="white" data-component-name="HeaderSteps" padding="xxs" radius="xs">
      <Icon name="layout-grid" size={24} />
      <NumericInput max={256} min={1} name="steps" onChange={handleChangeSteps} value={steps} />
    </Flex>
  );
}
