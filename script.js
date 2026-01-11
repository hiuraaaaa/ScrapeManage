// GANTI DENGAN DATA DARI SUPABASE SETTINGS > API
const SB_URL = "https://sjqawvdabdliehzxqlbz.supabase.co"; 
const SB_KEY = "sb_publishable__fhxF1Y__FsdwpsYDZJ0Qg_qyylrLzt";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

// Auth Admin
function checkAuth() {
    const pass = document.getElementById('adminPass').value;
    if (pass === "admin123") {
        localStorage.setItem('isLoggedIn', 'true');
        location.reload();
    } else {
        alert("Password Salah!");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    location.reload();
}

// Ambil Data ke Home
async function loadSnippets() {
    const listDiv = document.getElementById('snippet-list');
    if (!listDiv) return;

    const { data, error } = await _supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        listDiv.innerHTML = `<p style="color:red">Error koneksi database.</p>`;
    } else if (data.length === 0) {
        listDiv.innerHTML = `<p style="color:#555; text-align:center;">Belum ada snippet.</p>`;
    } else {
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
        lucide.createIcons();
    }
}

// Upload ke Database
async function handleUpload() {
    const title = document.getElementById('title').value;
    const tags = document.getElementById('tags').value;
    const code = document.getElementById('code').value;

    if (!title || !code) return alert("Isi data dengan lengkap!");

    const { error } = await _supabase.from('snippets').insert([{ title, tags, code }]);

    if (error) {
        alert("Gagal: " + error.message);
    } else {
        alert("Berhasil Upload!");
        window.location.href = 'index.html';
    }
}

window.onload = function() {
    const isLogged = localStorage.getItem('isLoggedIn');
    const loginForm = document.getElementById('loginForm');
    const uploadPanel = document.getElementById('uploadPanel');
    
    if (isLogged === 'true') {
        if (loginForm) loginForm.style.display = 'none';
        if (uploadPanel) uploadPanel.style.display = 'block';
    }
    loadSnippets();
};
