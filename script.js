// ==========================================
// KONFIGURASI SUPABASE
// ==========================================
const SB_URL = "https://sjqawvdabdliehzxqlbz.supabase.co"; // Ganti dengan Project URL kamu
const SB_KEY = "sb_publishable__fhxF1Y__FsdwpsYDZJ0Qg_qyylrLzt"; // Ganti dengan Anon Public Key kamu
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// ==========================================
// SISTEM AUTH (ADMIN)
// ==========================================
function checkAuth() {
    const pass = document.getElementById('adminPass').value;
    // Password admin untuk masuk ke panel upload
    if (pass === "admin123") { 
        localStorage.setItem('isLoggedIn', 'true');
        location.reload();
    } else {
        alert("Password Salah! Akses ditolak.");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    location.reload();
}

// ==========================================
// FUNGSI LOAD DATA (HOME)
// ==========================================
async function loadSnippets() {
    const listDiv = document.getElementById('snippet-list');
    if (!listDiv) return; // Hanya jalankan jika ada elemennya (di index.html)

    const { data, error } = await _supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        listDiv.innerHTML = `<p style="color:red; text-align:center;">Gagal memuat data database.</p>`;
        return;
    }

    if (data.length === 0) {
        listDiv.innerHTML = `<p style="color:#555; text-align:center; margin-top:50px;">Belum ada snippet kode yang tersedia.</p>`;
        return;
    }

    // Merender list kartu yang bisa diklik menuju detail.html
    listDiv.innerHTML = data.map(item => `
        <a href="detail.html?id=${item.id}" style="text-decoration: none; color: inherit;">
            <div class="snippet-card">
                <div class="icon-wrapper"><i data-lucide="code"></i></div>
                <div class="snippet-info">
                    <h3>${item.title}</h3>
                    <div class="tags">
                        ${item.tags ? item.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        </a>
    `).join('');
    
    // Inisialisasi icon lucide setelah elemen HTML dibuat
    lucide.createIcons();
}

// ==========================================
// FUNGSI UPLOAD DATA (ADMIN)
// ==========================================
async function handleUpload() {
    const title = document.getElementById('title').value;
    const tags = document.getElementById('tags').value;
    const code = document.getElementById('code').value;

    if (!title || !code) {
        return alert("Judul dan Konten Kode wajib diisi!");
    }

    // Animasi loading pada tombol
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerText;
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const { error } = await _supabase
        .from('snippets')
        .insert([{ title, tags, code }]);

    if (error) {
        alert("Gagal Upload: " + error.message);
        btn.innerText = originalText;
        btn.disabled = false;
    } else {
        alert("Berhasil! Snippet kamu sudah terbit.");
        window.location.href = 'index.html';
    }
}

// ==========================================
// INISIALISASI HALAMAN
// ==========================================
window.onload = function() {
    const isLogged = localStorage.getItem('isLoggedIn');
    const loginForm = document.getElementById('loginForm');
    const uploadPanel = document.getElementById('uploadPanel');
    
    // Logika tampilan untuk halaman upload.html
    if (isLogged === 'true') {
        if (loginForm) loginForm.style.display = 'none';
        if (uploadPanel) uploadPanel.style.display = 'block';
    } else {
        if (loginForm) loginForm.style.display = 'block';
        if (uploadPanel) uploadPanel.style.display = 'none';
    }

    // Jalankan fungsi load data jika berada di halaman home
    loadSnippets();
};
