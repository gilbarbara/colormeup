import { Box, Button, Paragraph } from '@gilbarbara/components';

interface ReloadProps {
  updateSW: (reloadPage?: boolean | undefined) => Promise<void>;
}

function Reload({ updateSW }: ReloadProps) {
  const handleClick = async () => {
    await updateSW(true);
  };

  return (
    <Box bg="black" data-component-name="Reload" padding="md" radius="md">
      <Paragraph bold mb="sm">
        There's a new version of the app.
      </Paragraph>
      <Button bg="white" onClick={handleClick} size="sm" style={{ pointerEvents: 'all' }}>
        Update
      </Button>
    </Box>
  );
}

export default Reload;
