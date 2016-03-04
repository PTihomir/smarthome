'use strict';
import './style/base.scss';

// import data from './data.js';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Presets, LookRoot } from 'react-look';

// import Gallery from './layout/gallery.js';

// ReactDOM.render(
//   <Gallery />,
//   document.getElementById('content'));

// import Layout from './layout/icon_list.js';
import Layout from './layout/tile_layout.js';

injectTapEventPlugin();

const config = Presets['react-dom'];

ReactDOM.render(
  <LookRoot config={config}>
    <Layout />
  </LookRoot>,
  document.getElementById('content'));
