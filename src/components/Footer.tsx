import { Anchor, Flex, Icon, Paragraph } from '@gilbarbara/components';

export default function Footer() {
  return (
    <Flex
      align="center"
      as="footer"
      bg="white"
      bottom={0}
      data-component-name="Footer"
      height={48}
      justify="space-between"
      left={0}
      position="absolute"
      px="md"
      right={0}
    >
      <Paragraph>© 2015 Gil Barbara</Paragraph>
      <Anchor external href="https://github.com/gilbarbara/colormeup">
        <Icon color="black" name="github" size={32} />
      </Anchor>
    </Flex>
  );
}
