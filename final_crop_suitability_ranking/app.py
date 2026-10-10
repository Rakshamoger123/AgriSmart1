from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# File paths and model loading
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

CSV_FILE = BASE_DIR / "final_crop_suitability_ranking.csv"
MODEL_FILE = BASE_DIR / "climate_crop_rf_model.joblib"
ENCODER_FILE = BASE_DIR / "climate_crop_label_encoder.joblib"

rankings = pd.read_csv(CSV_FILE)
model = joblib.load(MODEL_FILE)
label_encoder = joblib.load(ENCODER_FILE)

FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]


# --------------------------------------------------
# Helper function
# --------------------------------------------------

def get_district_season_rows(district, season):
    return rankings[
        (
            rankings["district"].astype(str).str.strip().str.casefold()
            == district.casefold()
        )
        &
        (
            rankings["season"].astype(str).str.strip().str.casefold()
            == season.casefold()
        )
    ].copy()
def get_column_value(row, possible_names):
    """Return a numeric value only when a matching CSV column exists."""
    for column in possible_names:
        if column in row.index:
            value = pd.to_numeric(row[column], errors="coerce")
            if pd.notna(value):
                return round(float(value), 2)
    return None



def get_suitability_breakdown(row):
    """Format existing ranking components for percentage display."""

    climate_soil = get_column_value(
        row, ["climate_soil_score"]
    )

    rainfall = get_column_value(
        row, ["rainfall_suitability_pct"]
    )

    ml_support = get_column_value(
        row, ["rf_probability_norm"]
    )

    return {
        "climate_soil_score": (
            round(climate_soil * 100, 2)
            if climate_soil is not None
            else None
        ),
        "rainfall_suitability": rainfall,
        "ml_model_support": (
            round(ml_support * 100, 2)
            if ml_support is not None
            else None
        ),
        "district_evidence": (
            str(row["evidence_status"])
            if "evidence_status" in row.index
            and pd.notna(row["evidence_status"])
            else None
        ),
    }

def calculate_risk_level(breakdown):
    """
    Estimate risk from available climate and rainfall
    suitability indicators. This is a rule-based estimate,
    not a scientifically validated risk prediction.
    """
    indicators = [
        breakdown.get("climate_soil_score"),
        breakdown.get("rainfall_suitability"),
    ]

    scores = [
        float(score)
        for score in indicators
        if score is not None
    ]

    if not scores:
        return {
            "risk_level": "Not assessed",
            "risk_score": None,
            "risk_message": "Required suitability indicators are unavailable."
        }

    average_suitability = sum(scores) / len(scores)
    estimated_risk = round(100 - average_suitability, 2)

    if estimated_risk <= 25:
        level = "Low"
        message = "Available suitability indicators suggest lower estimated risk."
    elif estimated_risk <= 50:
        level = "Medium"
        message = "Some suitability factors may require attention."
    else:
        level = "High"
        message = "Available suitability indicators suggest greater potential risk."

    return {
        "risk_level": level,
        "risk_score": estimated_risk,
        "risk_message": message
    }



# --------------------------------------------------
# Health routes
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AgriSmart backend is running"
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok"
    })
@app.route("/options", methods=["GET"])
def get_options():
    return jsonify({
        "districts": sorted(
            rankings["district"].dropna().astype(str).str.strip().unique().tolist()
        ),
        "seasons": sorted(
            rankings["season"].dropna().astype(str).str.strip().unique().tolist()
        ),
        "crops": sorted(
            rankings["crop"].dropna().astype(str).str.strip().unique().tolist()
        ),
    })


# --------------------------------------------------
# Crop prediction route
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}

    district = str(data.get("district") or "").strip()
    season = str(data.get("season") or "Monsoon").strip()

    if not district:
        return jsonify({
            "error": "District is required"
        }), 400

    matches = get_district_season_rows(district, season)

    # Use the Random Forest model when slider inputs are supplied.
    slider_keys = [
        "N",
        "P",
        "K",
        "ph",
        "rainfall",
        "temperature",
    ]

    if any(key in data for key in slider_keys):

        if matches.empty:
            return jsonify({
                "error": (
                    f"No ranking data found for {district}, {season}"
                )
            }), 404

        required_inputs = [
            "N",
            "P",
            "K",
            "ph",
            "rainfall",
            "temperature",
        ]

        missing_inputs = [
            key for key in required_inputs
            if data.get(key) is None
        ]

        if missing_inputs:
            return jsonify({
                "error": "Missing prediction inputs",
                "missing_inputs": missing_inputs,
                "received_inputs": data,
            }), 400

        try:
            # Use humidity from the existing district-season CSV row.
            humidity = float(matches.iloc[0]["humidity"])

            values = {
                "N": float(data["N"]),
                "P": float(data["P"]),
                "K": float(data["K"]),
                "temperature": float(data["temperature"]),
                "humidity": humidity,
                "ph": float(data["ph"]),
                "rainfall": float(data["rainfall"]),
            }

            if not all(
                pd.notna(value) for value in values.values()
            ):
                raise ValueError(
                    "All model inputs must be valid numbers."
                )

            # Keep the feature order consistent with model training.
            input_df = pd.DataFrame(
                [[values[feature] for feature in FEATURES]],
                columns=FEATURES,
            )

            probabilities = model.predict_proba(input_df)[0]
            top_indices = probabilities.argsort()[::-1][:5]

            results = []

            for index in top_indices:
                class_id = int(model.classes_[index])

                crop = label_encoder.inverse_transform(
                    [class_id]
                )[0]

                probability = float(probabilities[index])

                results.append({
                    "crop": str(crop),
                    "score": round(probability * 100, 2),
                    "rank": len(results) + 1,
                })

            best = results[0]

            return jsonify({
                "district": district,
                "season": season,
                "best_crop": {
                    "crop": best["crop"],
                    "confidence": round(
                        best["score"] / 100, 4
                    ),
                    "score": best["score"],
                    "rank": best["rank"],
                },
                "alternatives": results[1:],
                "rankings": results,
                "humidity_used": humidity,
                "prediction_method": "Random Forest model",
                "note": (
                    "Scores are model probabilities, not guaranteed "
                    "crop suitability or yield."
                ),
            })
        

        except (TypeError, ValueError, KeyError) as exc:
            return jsonify({
                "error": f"Invalid prediction input: {exc}"
            }), 400

        except Exception:
            app.logger.exception("Model prediction failed")
            return jsonify({
                "error": "The crop prediction model failed."
            }), 500

    # --------------------------------------------------
    # CSV-based fallback when slider inputs are absent
    # --------------------------------------------------

    if matches.empty:
        return jsonify({
            "error": (
                f"No recommendations found for {district}, {season}"
            ),
            "available_districts": sorted(
                rankings["district"]
                .dropna()
                .astype(str)
                .unique()
                .tolist()
            ),
        }), 404

    required_columns = {
        "rank_v4",
        "final_score_v4_pct",
        "crop",
    }

    if not required_columns.issubset(rankings.columns):
        return jsonify({
            "error": "Required ranking columns are missing from the CSV",
        }), 500

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
        return jsonify({
            "error": "No valid ranking scores found"
        }), 500

    results = []

    for _, row in matches.head(5).iterrows():
        results.append({
            "crop": str(row["crop"]),
            "score": round(
                float(row["final_score_v4_pct"]), 2
            ),
            "rank": int(row["rank_v4"]),
        })
        
    best = results[0]

    current_crop = str(data.get("current_crop") or "").strip()

    current_matches = matches[
        matches["crop"].astype(str).str.strip().str.casefold()
        == current_crop.casefold()
    ] if current_crop else matches.iloc[0:0]

    current_crop_score = None

    if not current_matches.empty:
        current_crop_score = round(
            float(current_matches.iloc[0]["final_score_v4_pct"]), 2
        )

    score_difference = (
        round(best["score"] - current_crop_score, 2)
        if current_crop_score is not None
        else None
    )

    if not current_crop:
        decision = "CURRENT CROP REQUIRED"
    elif current_crop_score is None:
        decision = "CURRENT CROP SCORE UNAVAILABLE"
    elif current_crop.casefold() == best["crop"].casefold():
        decision = "CURRENT CROP IS TOP RANKED"
    elif score_difference >= 20:
        decision = "STRONG SWITCH CANDIDATE"
    elif score_difference >= 10:
        decision = "POTENTIAL SWITCH CANDIDATE"
    elif score_difference > 0:
        decision = "SMALL SUITABILITY IMPROVEMENT"
    else:
        decision = "NO SUITABILITY ADVANTAGE"

    recommended_rows = matches[
        matches["crop"].astype(str).str.strip().str.casefold()
        == best["crop"].casefold()
    ]

    suitability_breakdown = (
        get_suitability_breakdown(recommended_rows.iloc[0])
        if not recommended_rows.empty
        else {
            "climate_soil_score": None,
            "rainfall_suitability": None,
            "ml_model_support": None,
            "district_evidence": None,
        }
    )
    risk_assessment = calculate_risk_level(
    suitability_breakdown
)

    return jsonify({
    "district": district,
    "season": season,
    "current_crop": current_crop or None,
    "current_crop_score": current_crop_score,
    "recommended_crop": best["crop"],
    "recommended_score": best["score"],
    "score_difference": score_difference,
    "decision": decision,
    "best_crop": {
        "crop": best["crop"],
        "confidence": round(best["score"] / 100, 4),
        "score": best["score"],
        "rank": best["rank"],
    },
    "alternatives": results[1:],
    "rankings": results,
    "suitability_breakdown": suitability_breakdown,
    "risk_level": risk_assessment["risk_level"],
    "risk_message": risk_assessment["risk_message"],
    "prediction_method": "CSV suitability ranking",
    "note": (
        "Suitability scores are model-based indicators, "
        "not guaranteed crop yield or field performance."
    ),
})
    best = results[0]

    current_crop = str(data.get("current_crop") or "").strip()

    current_matches = (
        matches[
            matches["crop"].astype(str).str.strip().str.casefold()
            == current_crop.casefold()
        ]   
        if current_crop
        else matches.iloc[0:0]
    )
    print("Selected district:", district)
    print("Selected season:", season)
    print("Selected crop:", repr(current_crop))
    print("Matching rows:", len(current_matches))

    if not current_matches.empty:
        print(current_matches[[
            "district", "season", "crop", "final_score_v4_pct"
        ]].to_string(index=False))

        current_crop_score = (
            round(
                float(current_matches.iloc[0]["final_score_v4_pct"]),
                2,
            )
            if not current_matches.empty
            else None
        )

    score_difference = (
        round(best["score"] - current_crop_score, 2)
        if current_crop_score is not None
        else None
    )

    if not current_crop:
        decision = "CURRENT CROP REQUIRED"
    elif current_crop_score is None:
        decision = "CURRENT CROP SCORE UNAVAILABLE"
    elif current_crop.casefold() == best["crop"].casefold():
        decision = "CURRENT CROP IS TOP RANKED"
    elif score_difference >= 20:
        decision = "STRONG SWITCH CANDIDATE"
    elif score_difference >= 10:
        decision = "POTENTIAL SWITCH CANDIDATE"
    elif score_difference > 0:
        decision = "SMALL SUITABILITY IMPROVEMENT"
    else:
        decision = "NO SUITABILITY ADVANTAGE"

    recommended_rows = matches[
        matches["crop"].astype(str).str.strip().str.casefold()
        == best["crop"].casefold()
    ]

    suitability_breakdown = (
        get_suitability_breakdown(recommended_rows.iloc[0])
        if not recommended_rows.empty
        else {
            "climate_soil_score": None,
            "rainfall_suitability": None,
            "ml_model_support": None,
            "district_evidence": None,
        }
    )

    return jsonify({
        "district": district,
        "season": season,
        "current_crop": current_crop or None,
        "current_crop_score": current_crop_score,
        "recommended_crop": best["crop"],
        "recommended_score": best["score"],
        "score_difference": score_difference,
        "decision": decision,
        "best_crop": {
            "crop": best["crop"],
            "confidence": round(best["score"] / 100, 4),
            "score": best["score"],
            "rank": best["rank"],
        },
        "alternatives": results[1:],
        "rankings": results,
        "suitability_breakdown": suitability_breakdown,
        "risk_level": risk_assessment["risk_level"],
        "risk_score": risk_assessment["risk_score"],
        "risk_message": risk_assessment["risk_message"],
        "prediction_method": "CSV suitability ranking",
        "note": (
            "Suitability scores are model-based indicators, "
            "not guaranteed crop yield or field performance."
        ),
    })


# --------------------------------------------------
# Start server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )