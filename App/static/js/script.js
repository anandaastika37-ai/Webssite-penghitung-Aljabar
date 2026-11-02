// ============================================================
// Elemen
// ============================================================
const matrix = document.getElementById('matrix');
const submitMatrix = document.getElementById('submit_matrix');

const ordoForm = document.getElementById('ordoForm');
const matrixName = document.getElementById('matrixName');
const row = document.getElementById('row');
const collum = document.getElementById('collum');
const previousBtnOrdo = document.getElementById('previousOrdo');
const nextBtnOrdo = document.getElementById('nextOrdo');
const submitOrdo = document.getElementById('submitOrdo');

const ordoList = document.getElementById('ordoList');
const detailName = document.getElementById('detailName');
const detailOrdo = document.getElementById('detailOrdo');
const detailDesc = document.getElementById('detailDesc');

const alphaOpration = document.querySelector('.opration');
const btnOpration = document.querySelector('.btn-opration');

const Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ============================================================
// State
// ============================================================
let ordoMatrix = {};   // { A: { row: '2', collum: '3' }, B: { ... } }
let userMatrix = [];   // ['A', 'B', 'C', ...]
let operatorOpration = [];

// ============================================================
// Buat daftar matriks
// ============================================================
submitMatrix.addEventListener('click', makeMatrix);

function makeMatrix() {
    const matrixValue = Math.min(Math.floor(Number(matrix.value)), Alphabet.length);

    if (!matrixValue || matrixValue < 1) {
        alert('Masukkan jumlah matriks minimal 1');
        return;
    }

    userMatrix = Alphabet.slice(0, matrixValue);
    ordoMatrix = getMatrix(userMatrix);   // 1. isi ordoMatrix dulu

    showExpression();                     // 2. tampilkan baris operasi
    ordoInit.reset();                     // 3. index ke 0, tampilkan A, kosongkan input
    renderOrdoList();                     // 4. daftar ordo kosong lagi
    console.log(ordoMatrix);
}

function getMatrix(names) {
    const result = {};
    names.forEach(name => {
        result[name] = { row: '', collum: '' };
    });
    return result;
}

function showExpression() {
    const btn = '<button type="button" id="submit_expression" class="btn mt-4">Submit</button>';
    alphaOpration.innerHTML = '';

    if (userMatrix !== null && userMatrix !== undefined) {
        const opration = userMatrix
            .map(a => `<span class="sym">${a}</span>`)
            .join('<input type="text" name="opration" placeholder="+" aria-label="Operator" class="field w-16 text-center text-lg">');

        alphaOpration.innerHTML += opration;
        btnOpration.innerHTML = btn;
    }
}

// ============================================================
// Helper
// ============================================================
function isOrdoFilled(name) {
    const o = ordoMatrix[name];
    return !!o && Number(o.row) >= 1 && Number(o.collum) >= 1;
}

// ============================================================
// Render
// ============================================================

// Daftar ordo semua matriks (hanya yang sudah diisi)
function renderOrdoList() {
    const filled = userMatrix.filter(isOrdoFilled);

    if (filled.length === 0) {
        ordoList.innerHTML = '<p class="text-sm text-slate-500">Belum ada ordo yang diisi.</p>';
        return;
    }

    ordoList.innerHTML = filled.map(name => {
        const o = ordoMatrix[name];
        return `
            <div class="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
                <span class="sym">${name}</span>
                <div>
                    <p class="text-lg font-semibold tabular-nums text-primary-700">${o.row} × ${o.collum}</p>
                    <p class="text-xs italic text-slate-500">${o.row} baris dan ${o.collum} kolom</p>
                </div>
            </div>`;
    }).join('');
}

// Ordo matriks yang sedang aktif
function renderDetail(name) {
    detailName.textContent = name || '';

    if (name && isOrdoFilled(name)) {
        const o = ordoMatrix[name];
        detailOrdo.textContent = `${o.row} × ${o.collum}`;
        detailDesc.textContent = `${o.row} baris dan ${o.collum} kolom`;
    } else {
        detailOrdo.textContent = '–';
        detailDesc.textContent = name ? 'Ordo belum diisi' : 'Atur jumlah matriks terlebih dahulu';
    }
}

// ============================================================
// Input ordo (next / previous / simpan)
// ============================================================
class inputOrdo {
    constructor() {
        this.currentIndex = 0;
    }

    getCurrentName() {
        return userMatrix[this.currentIndex];
    }

    // Ambil data matriks, buat kalau belum ada (supaya tidak error)
    getEntry(name) {
        if (!ordoMatrix[name]) {
            ordoMatrix[name] = { row: '', collum: '' };
        }
        return ordoMatrix[name];
    }

    // Simpan isi input ke ordoMatrix
    save() {
        const name = this.getCurrentName();
        if (!name) return;

        const entry = this.getEntry(name);
        entry.row = row.value;
        entry.collum = collum.value;

        renderOrdoList();
        renderDetail(name);
    }

    // Tampilkan data matriks saat ini ke input
    load() {
        const name = this.getCurrentName();
        if (!name) return;

        const entry = this.getEntry(name);
        matrixName.textContent = name;
        row.value = entry.row;
        collum.value = entry.collum;

        renderDetail(name);
    }

    nextOrdo() {
        this.save();
        if (this.currentIndex < userMatrix.length - 1) {
            this.currentIndex++;
        }
        this.load();
    }

    previousOrdo() {
        this.save();
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
        this.load();
    }

    reset() {
        this.currentIndex = 0;
        this.load();
    }

    getMissing() {
        return userMatrix.filter(name => !isOrdoFilled(name));
    }

    isAllFilled() {
        return userMatrix.length > 0 && this.getMissing().length === 0;
    }
}

const ordoInit = new inputOrdo();

nextBtnOrdo.addEventListener('click', () => ordoInit.nextOrdo());
previousBtnOrdo.addEventListener('click', () => ordoInit.previousOrdo());

row.addEventListener('input', () => ordoInit.save());
collum.addEventListener('input', () => ordoInit.save());
ordoForm.addEventListener('submit', e => e.preventDefault());

submitOrdo.addEventListener('click', () => {
    if (userMatrix.length === 0) {
        alert('Atur jumlah matriks terlebih dahulu');
        return;
    }
    ordoInit.save();   

    if (!ordoInit.isAllFilled()) {
        alert(`Ordo matriks ${ordoInit.getMissing().join(', ')} belum diisi`);
        return;
    }
    console.log(ordoMatrix);

});

renderOrdoList();
renderDetail();