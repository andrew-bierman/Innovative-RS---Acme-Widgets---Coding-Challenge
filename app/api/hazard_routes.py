from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard
from app.models import db

hazard_routes = Blueprint("hazard_routes", __name__)

@hazard_routes.route("/step/<int:step_id>/hazard", methods=["POST"])
def create_hazard(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    data = request.get_json()
    description = data.get("description")
    if not description:
        return jsonify({"message": "Description is required"}), 400

    consequence = data.get("consequence", "")
    
    hazard = Hazard(description=data["description"], consequence=consequence, step_id=step.id)
    db.session.add(hazard)
    db.session.commit()

    return jsonify({
        "message": "Hazard created",
        "hazard": {
            "id": hazard.id,
            "description": hazard.description,
            "consequence": hazard.consequence,
            "step_id": hazard.step_id,
            "jha_id": step.jha_id
        }
    })


@hazard_routes.route("/hazard/<int:hazard_id>", methods=["PUT"])
def update_hazard(hazard_id):
    hazard = Hazard.query.get(hazard_id)
    if not hazard:
        return jsonify({"message": "Hazard not found"}), 404
    data = request.get_json()
    hazard.description = data["description"]
    db.session.commit()
    step = Step.query.get(hazard.step_id)
    jha_id = step.jha_id
    return jsonify({"message": "Hazard updated", "hazard": {"id": hazard.id, "description": hazard.description, "step_id": hazard.step_id, "jha_id": jha_id}})



@hazard_routes.route("/hazard/<int:hazard_id>", methods=["DELETE"])
def delete_hazard(hazard_id):
    hazard = Hazard.query.get(hazard_id)
    if not hazard:
        return jsonify({"message": "Hazard not found"}), 404
    db.session.delete(hazard)
    db.session.commit()
    return jsonify({"message": "Hazard deleted"})

@hazard_routes.route("/step/<int:step_id>/hazard", methods=["GET"])
def get_hazards(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    return jsonify({"hazards": [{"id": hazard.id, "description": hazard.description, "control": hazard.control} for hazard in step.hazards]})

