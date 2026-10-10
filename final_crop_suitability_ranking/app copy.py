
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
CSV_FILE = BASE_DIR / "final_crop_suitability_ranking.csv"

rankings = pd.read_csv(CSV_FILE)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AgriSmart backend is running"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    district = str(data.get("district", "")).strip()
    season = str(data.get("season") or "Monsoon").strip()

    if not district:
        return jsonify({"error": "District is required"}), 400

    required_columns = {
        "district", "season", "crop",
        "rank_v4", "final_score_v4_pct"
    }

    if not required_columns.issubset(rankings.columns):
        return jsonify({
            "error": "The CSV columns do not match the expected format",
            "columns_found": rankings.columns.tolist()
        }), 500

    matches = rankings[
        (rankings["district"].astype(str).str.strip().str.casefold()
         == district.casefold())
        &
        (rankings["season"].astype(str).str.strip().str.casefold()
         == season.casefold())
    ].copy()

    if matches.empty:
        return jsonify({
            "error": f"No recommendations found for {district}, {season}",
            "available_districts": sorted(
                rankings["district"].dropna().astype(str).unique().tolist()
            )
        }), 404

    matches["rank_v4"] = pd.to_numeric(
        matches["rank_v4"], errors="coerce"
    )
    matches["final_score_v4_pct"] = pd.to_numeric(
        matches["final_score_v4_pct"], errors="coerce"
    )
    matches = matches.dropna(
        subset=["rank_v4", "final_score_v4_pct"]
    ).sort_values("rank_v4")

    if matches.empty:
        return jsonify({"error": "No valid ranking scores found"}), 500

    results = []
    for _, row in matches.head(5).iterrows():
        results.append({
            "crop": str(row["crop"]),
            "score": round(float(row["final_score_v4_pct"]), 2),
            "rank": int(row["rank_v4"])
        })

    best = results[0]

    return jsonify({
        "district": district,
        "season": season,
        "best_crop": {
            "crop": best["crop"],
            "confidence": round(best["score"] / 100, 4),
            "score": best["score"],
            "rank": best["rank"]
        },
        "alternatives": results[1:],
        "rankings": results,
        "note": "Suitability score is not a guarantee of crop yield."
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
