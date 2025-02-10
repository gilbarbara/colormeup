import { memo, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

import { name } from '~/config';

interface HeadProps {
  children?: ReactNode;
  defaultTitle?: string;
  descriptionSEO?: string;
  image?: string;
  pathname?: string;
  title?: string;
  titleSEO?: string;
  type?: string;
  url?: string;
}

function Head(props: HeadProps) {
  const {
    children,
    defaultTitle = name,
    descriptionSEO,
    image,
    pathname = '/',
    title = '',
    titleSEO,
    type = 'article',
    url,
    ...rest
  } = props;
  const fallbackUrl = `https://admin.gilbarbara.dev${pathname}`;

  return (
    <Helmet defaultTitle={defaultTitle} title={title} {...rest}>
      <title>{title}</title>
      {descriptionSEO && <meta content={descriptionSEO} name="description" />}
      <meta content={titleSEO ?? title} property="og:title" />
      <meta content={titleSEO ?? title} itemProp="og:headline" />
      {descriptionSEO && <meta content={descriptionSEO} property="og:description" />}
      {descriptionSEO && <meta content={descriptionSEO} itemProp="og:description" />}
      <meta content={type} property="og:type" />
      <meta content={url ?? fallbackUrl} property="og:url" />
      {image && <meta content={image} property="og:image" />}
      <link href={url ?? fallbackUrl} rel="canonical" />
      {children}
    </Helmet>
  );
}

export default memo(Head);
