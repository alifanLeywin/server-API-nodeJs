const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

const mysql = require('mysql2/promise');

const config = {
  host: 'localhost', // Alamat server MySQL
  user: 'root', // Username MySQL Anda
  password: '', // Password MySQL Anda
  database: 'InventoryDB', // Nama database
};

module.exports = config;

app.get('/api/data', async (req, res) => {
  try {
    const connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
      SELECT 
        t.id_transaksi, t.no_transaksi, t.tgl_transaksi, t.nama_kasir, t.total_bayar,
        u.nama AS nama_user, u.tipe_user,
        b.nama_barang, b.harga_satuan, b.jumlah_barang
      FROM tbl_transaksi t
      JOIN tbl_user u ON t.id_user = u.id_user
      JOIN tbl_barang b ON t.id_barang = b.id_barang
    `);

    res.json(rows);
    connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000/api/data`);
});