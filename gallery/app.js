'use strict';

const MANIFEST_URL = '/manifest.json';
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

let tree = {};
let currentPath = '';

// ── Bootstrap ──────────────────────────────────────────────────────────────

async function init() {
    try {
        const resp = await fetch(MANIFEST_URL);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const manifest = await resp.json();
        const files = (manifest.files || []).filter(f => isImage(f));
        tree = buildTree(files);
        renderSidebar();
        navigate('');
    } catch (err) {
        showError(`Could not load gallery manifest: ${err.message}`);
    }
}

// ── Tree helpers ────────────────────────────────────────────────────────────

function isImage(path) {
    const dot = path.lastIndexOf('.');
    return dot !== -1 && IMAGE_EXTS.has(path.slice(dot).toLowerCase());
}

function buildTree(files) {
    const root = {};
    for (const file of files) {
        const parts = file.split('/');
        let node = root;
        for (let i = 0; i < parts.length - 1; i++) {
            const p = parts[i];
            if (!node[p]) node[p] = { _files: [] };
            node = node[p];
        }
        (node._files = node._files || []).push(parts[parts.length - 1]);
    }
    return root;
}

function getNode(path) {
    if (!path) return tree;
    let node = tree;
    for (const part of path.split('/')) {
        node = node[part];
        if (!node) return null;
    }
    return node;
}

function countImages(node) {
    if (!node) return 0;
    let n = (node._files || []).length;
    for (const k of Object.keys(node)) {
        if (k !== '_files') n += countImages(node[k]);
    }
    return n;
}

// ── Sidebar ─────────────────────────────────────────────────────────────────

function renderSidebar() {
    const tree_el = document.getElementById('folderTree');
    const topFolders = Object.keys(tree).filter(k => k !== '_files').sort();

    const folderIconSVG = `<svg class="tree-item-icon" width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
    </svg>`;

    const allIconSVG = `<svg class="tree-item-icon" width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    </svg>`;

    let html = `<div class="tree-item active" data-path="">${allIconSVG}All Photos</div>`;
    for (const folder of topFolders) {
        html += `<div class="tree-item" data-path="${folder}">${folderIconSVG}${folder}</div>`;
    }
    tree_el.innerHTML = html;

    tree_el.querySelectorAll('.tree-item').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.path));
    });
}

function syncSidebarActive(path) {
    const topSegment = path.split('/')[0];
    document.querySelectorAll('.tree-item').forEach(el => {
        const p = el.dataset.path;
        el.classList.toggle('active',
            p === '' ? path === '' : p === topSegment
        );
    });
}

// ── Navigation ───────────────────────────────────────────────────────────────

function navigate(path) {
    currentPath = path;
    const node = getNode(path);
    renderBreadcrumb(path);
    syncSidebarActive(path);
    renderContent(node, path);
    window.scrollTo(0, 0);
}

// ── Breadcrumb ───────────────────────────────────────────────────────────────

function renderBreadcrumb(path) {
    const bc = document.getElementById('breadcrumb');
    const parts = path ? path.split('/').filter(Boolean) : [];
    let html = `<span class="bc-item${parts.length === 0 ? ' current' : ''}" data-path="">Gallery</span>`;
    let cum = '';
    for (let i = 0; i < parts.length; i++) {
        cum += (cum ? '/' : '') + parts[i];
        const isCurrent = i === parts.length - 1;
        const cumCopy = cum;
        html += `<span class="bc-sep">/</span>
                 <span class="bc-item${isCurrent ? ' current' : ''}" data-path="${cumCopy}">${parts[i]}</span>`;
    }
    bc.innerHTML = html;
    bc.querySelectorAll('.bc-item:not(.current)').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.path));
    });
}

// ── Content renderer ─────────────────────────────────────────────────────────

const folderIconLargeSVG = `<svg class="folder-card-icon" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="8" width="48" height="32" rx="4" fill="#e5e7eb"/>
    <path d="M0 14C0 10.686 2.686 8 6 8H20L24 14H42C45.314 14 48 16.686 48 20V36C48 39.314 45.314 42 42 42H6C2.686 42 0 39.314 0 36V14Z" fill="#d1d5db"/>
    <path d="M0 16C0 12.686 2.686 10 6 10H20L24 16H42C45.314 16 48 18.686 48 22V34C48 37.314 45.314 40 42 40H6C2.686 40 0 37.314 0 34V16Z" fill="#2563eb" opacity=".15"/>
    <path d="M2 18C2 14.686 4.686 12 8 12H20L24 18H40C43.314 18 46 20.686 46 24V34C46 37.314 43.314 40 40 40H8C4.686 40 2 37.314 2 34V18Z" fill="#2563eb" opacity=".25"/>
</svg>`;

function renderContent(node, basePath) {
    const area = document.getElementById('contentArea');
    const stats = document.getElementById('stats');

    if (!node) {
        area.innerHTML = '<div class="empty-state"><p>Folder not found.</p></div>';
        stats.textContent = '';
        return;
    }

    const folders = Object.keys(node).filter(k => k !== '_files').sort();
    const files = (node._files || []).sort();
    const total = countImages(node);
    stats.textContent = `${total} photo${total !== 1 ? 's' : ''}`;

    let html = '';

    if (folders.length > 0) {
        html += '<div class="section-label">Folders</div>';
        html += '<div class="folder-grid">';
        for (const folder of folders) {
            const folderPath = basePath ? `${basePath}/${folder}` : folder;
            const count = countImages(node[folder]);
            html += `<div class="folder-card" data-path="${folderPath}">
                ${folderIconLargeSVG}
                <div class="folder-card-name">${folder}</div>
                <div class="folder-card-count">${count} photo${count !== 1 ? 's' : ''}</div>
            </div>`;
        }
        html += '</div>';
    }

    if (files.length > 0) {
        if (folders.length > 0) {
            html += '<div class="section-label">Photos</div>';
        }
        html += '<div class="photo-grid">';
        for (const file of files) {
            const filePath = basePath ? `${basePath}/${file}` : file;
            const name = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            html += `<div class="photo-card" data-src="/${filePath}" data-name="${escapeAttr(name)}">
                <img src="/${filePath}" alt="${escapeAttr(name)}" loading="lazy">
            </div>`;
        }
        html += '</div>';
    }

    if (folders.length === 0 && files.length === 0) {
        html = '<div class="empty-state"><p>This folder is empty.</p></div>';
    }

    area.innerHTML = html;

    area.querySelectorAll('.folder-card').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.path));
    });

    area.querySelectorAll('.photo-card').forEach(el => {
        el.addEventListener('click', () => openLightbox(el.dataset.src, el.dataset.name));
    });
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function openLightbox(src, name) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    img.src = src;
    img.alt = name;
    cap.textContent = name;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    document.getElementById('lightboxImg').src = '';
    document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ── Utilities ─────────────────────────────────────────────────────────────────

function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showError(msg) {
    document.getElementById('contentArea').innerHTML =
        `<div class="error-state"><p>${msg}</p></div>`;
    document.getElementById('folderTree').innerHTML =
        '<div class="tree-loading">Error</div>';
}

// ── Start ─────────────────────────────────────────────────────────────────────
init();
