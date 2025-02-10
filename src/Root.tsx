import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from '@emotion/styled';

import { name } from '~/config';
import { useAppSelector } from '~/modules/hooks';
import { selectApp, selectColor } from '~/store/selectors';

import Footer from '~/components/Footer';
import Overlay from '~/components/Overlay';
import Header from '~/containers/Header';
import Sidebar from '~/containers/Sidebar';
import SystemAlerts from '~/containers/SystemAlerts';
import Colors from '~/pages/Colors';
import NotFound from '~/pages/NotFound';

const RootWrapper = styled.main`
  background: #fff
    linear-gradient(
      -45deg,
      #f2f2f2 25%,
      transparent 25%,
      transparent 50%,
      #f2f2f2 50%,
      #f2f2f2 75%,
      transparent 75%,
      transparent
    );
  background-size: 40px 40px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 48px;
  position: relative;
`;

export default function Root() {
  const { isSidebarOpen } = useAppSelector(selectApp);
  const { hex } = useAppSelector(selectColor);

  return (
    <BrowserRouter>
      <RootWrapper data-component-name="Root">
        <Helmet
          defaultTitle={name}
          defer={false}
          encodeSpecialCharacters
          htmlAttributes={{ lang: 'en-us' }}
          titleAttributes={{ itemprop: 'name', lang: 'en-us' }}
          titleTemplate={`%s | ${name}`}
        />
        {!!hex && <Sidebar />}
        <Header />
        <Routes>
          <Route element={<Colors />} path="/" />
          <Route element={<NotFound />} path="*" />
        </Routes>
        <Footer />
        <Overlay isSidebarOpen={isSidebarOpen} />
        <SystemAlerts />
      </RootWrapper>
    </BrowserRouter>
  );
}
