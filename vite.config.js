import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from 'vite-plugin-svgr'
import { resolve } from "path";
import fs from 'fs';
import dns from 'dns'
import legacy from '@vitejs/plugin-legacy'

// Use localhost instead of 127.0.0.1.
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

const srcFolders = fs.readdirSync('./src', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

export default defineConfig({
    server: {
        port: 3000
    },
    // https://blog.logrocket.com/vite-3-vs-create-react-app-comparison-migration-guide/#migrating-create-react-app-vite
    // See "Absolute imports", after migration from CRA.
    resolve: {
        alias: srcFolders.map(folder =>(
            {
                find: folder,
                replacement: resolve(__dirname, `src/${folder}`)
            }))
    },
    plugins: [react({
        babel: {
            plugins: ['preval'],
        }
    }), svgr(),
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),],
});
