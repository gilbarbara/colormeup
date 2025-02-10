import { Flex, FlexInline, Snippet, Text } from '@gilbarbara/components';

interface InfoProps {
  data: {
    chroma: number;
    currentColor: string;
    hex: string;
    hsl: string;
    luminance: number;
    rgb: string;
    textColor: string;
  };
}

export default function Info({ data }: InfoProps) {
  return (
    <Flex data-component-name="Info" direction="column" gap="xs" mt="xs">
      <Snippet
        bg={data.hex}
        data-component-name="CopyHEX"
        hideSymbol
        justify="space-between"
        py="xxs"
        removeFormatting
        size="sm"
      >
        <Text size="md">{data.hex}</Text>
      </Snippet>
      <Snippet
        bg={data.hex}
        data-component-name="CopyRGB"
        hideSymbol
        justify="space-between"
        py="xxs"
        removeFormatting
        size="sm"
      >
        <Text size="md">{data.rgb}</Text>
      </Snippet>
      <Snippet
        bg={data.hex}
        data-component-name="CopyHSL"
        hideSymbol
        justify="space-between"
        py="xxs"
        removeFormatting
        size="sm"
      >
        <Text size="md">{data.hsl}</Text>
      </Snippet>

      <FlexInline border justify="space-between" px="xs" py="xxs" radius="xs">
        <Text>color</Text> {data.textColor}
      </FlexInline>
      <FlexInline border justify="space-between" px="xs" py="xxs" radius="xs">
        <Text>chroma</Text> {data.chroma}
      </FlexInline>
      <FlexInline border justify="space-between" px="xs" py="xxs" radius="xs">
        <Text>luminance</Text> {data.luminance}
      </FlexInline>
    </Flex>
  );
}
