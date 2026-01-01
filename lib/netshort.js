import NetshortAPI from './netshort-api.js';

const api = new NetshortAPI();

// --- FUNGSI PEMBANTU: CEK LOGIN DULU ---
// Serverless function sifatnya sementara, jadi token bisa hilang.
// Kita cek: Kalau token kosong, login dulu. Kalau sudah ada, lanjut.
const ensureToken = async () => {
    if (!api.token) {
        console.log("⚠️ Token kosong atau server baru restart. Melakukan login...");
        try {
            const res = await api.login();
            if (res.success) {
                console.log("✅ Login Berhasil. Token didapat.");
            } else {
                console.error("❌ Login Gagal:", res);
            }
        } catch (e) {
            console.error("❌ Error saat login:", e.message);
        }
    }
};

const foryou = async (page) => {
    await ensureToken(); // <--- Pastikan login dulu sebelum ambil data
    try {
        const res = await api.fetchRecommendAll(page);
        // Validasi data biar tidak crash jika server return error
        if (res && res.data) {
            return res.data;
        } else {
            console.log("⚠️ Data ForYou kosong/gagal:", res);
            return []; 
        }
    } catch (error) {
        console.error("Error ForYou:", error.message);
        return []; // Return array kosong biar frontend tidak blank putih
    }
}

const theaters = async () => {
    await ensureToken();
    try {
        const res = await api.fetchTheaters();
        return res.data || [];
    } catch (error) {
        console.error("Error Theaters:", error.message);
        return [];
    }
}

const search = async (query) => {
    await ensureToken();
    try {
        const res = await api.fetchSearch(query);
        return res.data || {};
    } catch (error) {
        console.error("Error Search:", error.message);
        return {};
    }
}

const allepisode = async (shortPlayId) => {
    await ensureToken();
    try {
        const res = await api.fetchDetail(shortPlayId);
        return res.data || {};
    } catch (error) {
        console.error("Error AllEpisode:", error.message);
        return {};
    }
}

export { foryou, theaters, search, allepisode };
export default { foryou, theaters, search, allepisode };
