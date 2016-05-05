import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';


if (document.getElementById('outlet')) {
	ReactDOM.render(<Map />, document.getElementById('outlet'));
}
