import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'/akipiyopiyo24/',resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},css:{postcss:{plugins:[tailwindcss()]}},plugins:[react()]});
