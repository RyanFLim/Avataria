import React from 'react';

function GameOver({ onBack, stats }) {
  return (
    <div
      id="back"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        // marginTop: 150, // HAPUS atau ganti jadi lebih kecil
        backgroundColor: "transparent",
        minHeight: "100vh"
      }}
    >
      <h1
        style={{
          color: "white",
          backgroundColor: "red",
          borderRadius: 10,
          height: 38,
          width: 300,
          textAlign: "center",
          lineHeight: "38px"
        }}
      >
        GAME OVER
      </h1>
      <h3
        style={{
          color: "white",
          marginTop: 20
        }}
      >
        Score:
      </h3>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          color: "white",
          marginTop: 10,
          textAlign: "center"
        }}
      >
        <li>Total Tidur: {stats.tidur}</li>
        <li>Total Mandi: {stats.mandi}</li>
        <li>Total Makan: {stats.makan}</li>
        <li>Total Olahraga: {stats.olahraga}</li>
        <li>Total Kerja: {stats.kerja}</li>
        <li>Uang Didapat: {stats.uangDidapat}</li>
        <li>Uang Dihabiskan: {stats.uangDihabiskan}</li>
        <li>
          Total: {stats.tidur + stats.mandi + stats.makan + stats.olahraga + stats.kerja}
        </li>
      </ul>
      <button
        id="balik"
        style={{
          borderRadius: 10,
          border: "3px solid black",
          marginTop: 24,
          fontWeight: "bold",
          fontSize: 18,
          padding: "8px 24px",
          cursor: "pointer",
          backgroundColor: "white",
          color: "black"
        }}
        onClick={onBack}
      >
        Back To Menu
      </button>
    </div>
  );
}

export default GameOver;
