import { FlexCenter, NonIdealState } from '@gilbarbara/components';

export default function NotFound() {
  return (
    <FlexCenter data-component-name="NotFound" flex>
      <NonIdealState icon="paintbrush" type="not-found" />
    </FlexCenter>
  );
}
