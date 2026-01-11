/* PENTING: 
  Agar kode ini jalan di Vercel, tambahkan SUPABASE_URL dan SUPABASE_KEY 
  di menu 'Environment Variables' pada Dashboard Vercel kamu.
*/

// Ambil config dari Environment (Vercel) atau gunakan string kosong jika lokal
const SB_URL = window.env?.SUPABASE_URL || "MASUKKAN_URL_SUPABASE_DI_VERCEL";
const SB_KEY = window.env?.SUPABASE_KEY || "MASUKKAN_KEY_SUPABASE_DI_VERCEL";

// Inisialisasi Supabase
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// --- SISTEM AUTH Sederhana ---
function checkAuth() {
    const pass = document.getElementById('adminPass').value;
    // Ganti 'admin123' dengan password rahasiamu
    if (pass === "admin123") { 
        localStorage.setItem('isLoggedIn', 'true');
        location.reload();
    } else {
        alert("Password salah! Akses ditolak.");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    location.reload();
}

// --- FUNGSI AMBIL DATA (HOME) ---
async function loadSnippets() {
    const listDiv = document.getElementById('snippet-list');
    if (!listDiv) return;

    const { data, error } = await _supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        listDiv.innerHTML = `<p style="color:red; text-align:center;">Gagal terhubung ke Database.</p>`;
        return;
    }

    if (data.length === 0) {
        listDiv.innerHTML = `<p style="color:#555; text-align:center; margin-top:50px;">Belum ada kode yang diupload.</p>`;
        return;
    }

    listDiv.innerHTML = data.map(item => `
        <div class="snippet-card">
            <div class="icon-wrapper"><i data-lucide="code"></i></div>
            <div class="snippet-info">
                <h3>${item.title}</h3>
                <div class="tags">
                    ${item.tags ? item.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Render icon lucide setelah HTML masuk
    lucide.createIcons();
}

// --- FUNGSI UPLOAD DATA (ADMIN) ---
async function handleUpload() {
    const title = document.getElementById('title').value;
    const tags = document.getElementById('tags').value;
    const code = document.getElementById('code').value;

    if (!title || !code) {
        return alert("Judul dan konten kode tidak boleh kosong!");
    }

    // Tampilkan loading di tombol
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
        alert("Berhasil! Kode kamu sudah live.");
        window.location.href = 'index.html';
    }
}

// --- INITIALIZE ---
window.onload = function() {
    const isLogged = localStorage.getItem('isLoggedIn');
    const loginForm = document.getElementById('loginForm');
    const uploadPanel = document.getElementById('uploadPanel');
    
    // Atur tampilan berdasarkan status login
    if (isLogged === 'true') {
        if (loginForm) loginForm.style.display = 'none';
        if (uploadPanel) uploadPanel.style.display = 'block';
    } else {
        if (loginForm) loginForm.style.display = 'block';
        if (uploadPanel) uploadPanel.style.display = 'none';
    }

    // Muat data jika ada di halaman home
    loadSnippets();
};
