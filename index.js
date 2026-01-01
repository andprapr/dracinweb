import express from 'express';
import apiRoutes from './routes/api.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup agar __dirname bisa dipakai di mode Module (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// Middleware Agar Frontend Bisa Akses Data
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

// 1. Sajikan folder 'public' secara statis (agar gambar/css bisa diakses)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Rute API
app.use('/api', apiRoutes);

// 3. Rute Halaman Utama (PENTING BUAT VERCEL)
// Kalau user buka "domain.com/", kirimkan file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listener lokal (tidak akan dijalankan oleh Vercel, tapi berguna buat tes lokal)
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Ekspor untuk Vercel
export default app;
