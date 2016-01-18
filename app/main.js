'use strict';
import './css/base.scss';

import data from './data.js';

import React from 'react';
import ReactDOM from 'react-dom';

import CoreLayout from './layout/core.js';

ReactDOM.render(
  <CoreLayout recipes={data} />,
  document.getElementById('content'));
