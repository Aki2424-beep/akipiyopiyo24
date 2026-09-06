import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from './app/page';
import Game from './app/game/page';
import './app/globals.css';
const isGame=window.location.pathname.replace(/\/$/,'').endsWith('/game');
document.title=isGame?'akipiyopiyo24 | ESS経営ゲーム':'akipiyopiyo24 | 個人学習ツール';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{isGame?<Game/>:<Home/>}</React.StrictMode>);
