#!/usr/bin/env node
'use strict';

const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify }           = require('terser');
const fs   = require('fs');
const path = require('path');

const ROOT     = path.join(__dirname, '..');
const GAME_SRC = path.join(ROOT, 'game');
const GAME_OUT = path.join(ROOT, '.dist');

// Security-sensitive files — obfuscated (harder to reverse-engineer)
const OBFUSCATE_FILES = new Set([
    'js/sample-file.js',
]);

// Other custom game files — minified only (smaller, faster)
const MINIFY_EXTENSIONS = new Set(['.js', '.css']);
const SKIP_MINIFY = new Set([
    // already minified third-party libs
    'js/sample-file.js',
    'js/sample-file.css'
]);

const OBFUSCATE_OPTIONS = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: true,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
};

const TERSER_OPTIONS = {
    compress: { drop_console: true, passes: 2 },
    mangle: true,
    format: { comments: false },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, files);
        else files.push(full);
    }
    return files;
}

function ensureDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function kb(bytes) {
    return (bytes / 1024).toFixed(1) + 'KB';
}

// ─── main ─────────────────────────────────────────────────────────────────────

if (fs.existsSync(GAME_OUT)) fs.rmSync(GAME_OUT, { recursive: true });

const allFiles = walk(GAME_SRC);
let counts = { obfuscated: 0, minified: 0, copied: 0 };

(async () => {
    for (const srcPath of allFiles) {
        const rel     = path.relative(GAME_SRC, srcPath);
        const ext     = path.extname(rel);
        const outPath = path.join(GAME_OUT, rel);
        ensureDir(outPath);

        if (OBFUSCATE_FILES.has(rel)) {
            const src    = fs.readFileSync(srcPath, 'utf8');
            const result = JavaScriptObfuscator.obfuscate(src, OBFUSCATE_OPTIONS);
            const out    = result.getObfuscatedCode();
            fs.writeFileSync(outPath, out, 'utf8');
            console.log(`[obfuscate] ${rel.padEnd(30)} ${kb(src.length)} → ${kb(out.length)}`);
            counts.obfuscated++;

        } else if (MINIFY_EXTENSIONS.has(ext) && !SKIP_MINIFY.has(rel)) {
            const src = fs.readFileSync(srcPath, 'utf8');
            try {
                const result = ext === '.js'
                    ? await minify(src, TERSER_OPTIONS)
                    : { code: src };
                const out = result.code;
                fs.writeFileSync(outPath, out, 'utf8');
                console.log(`[minify]    ${rel.padEnd(30)} ${kb(src.length)} → ${kb(out.length)}`);
                counts.minified++;
            } catch {
                fs.copyFileSync(srcPath, outPath);
                counts.copied++;
            }

        } else {
            fs.copyFileSync(srcPath, outPath);
            counts.copied++;
        }
    }

    console.log(`\nDone. ${counts.obfuscated} obfuscated, ${counts.minified} minified, ${counts.copied} copied → ${GAME_OUT}`);
})();
