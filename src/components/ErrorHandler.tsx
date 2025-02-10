import { Button, Container, NonIdealState } from '@gilbarbara/components';

interface ErrorHandlerProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorHandler({ error, resetErrorBoundary }: ErrorHandlerProps) {
  const handleClickReset = () => {
    resetErrorBoundary();
  };

  return (
    <Container align="center" data-component-name="ErrorHandler" fullScreen>
      <NonIdealState description={error.message} type="error">
        <Button bg="red" onClick={handleClickReset}>
          Tentar novamente
        </Button>
      </NonIdealState>
    </Container>
  );
}
