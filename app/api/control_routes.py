from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard, Control
from app.models import db

control_routes = Blueprint("control_routes", __name__)

@control_routes.route("/step/<int:step_id>/control", methods=["POST"])
def create_control(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    data = request.get_json()
    description = data.get("description")
    if not description:
        return jsonify({"message": "Description is required"}), 400

    control = Control(description=data["description"], step_id=step.id)
    db.session.add(control)
    db.session.commit()

    return jsonify({
        "message": "Control created",
        "control": {
            "id": control.id,
            "description": control.description,
            "step_id": control.step_id,
            "jha_id": step.jha_id
        }
    })

@control_routes.route("/control/<int:control_id>", methods=["PUT"])
def update_control(control_id):
    control = Control.query.get(control_id)
    if not control:
        return jsonify({"message": "Control not found"}), 404
    data = request.get_json()
    control.description = data["description"]
    db.session.commit()
    step = Step.query.get(control.step_id)
    jha_id = step.jha_id
    return jsonify({"message": "Control updated", "control": {"id": control.id, "description": control.description, "step_id": control.step_id, "jha_id": jha_id}})

@control_routes.route("/control/<int:control_id>", methods=["DELETE"])
def delete_control(control_id):
    control = Control.query.get(control_id)
    if not control:
        return jsonify({"message": "Control not found"}), 404
    db.session.delete(control)
    db.session.commit()
    return jsonify({"message": "Control deleted"})

@control_routes.route("/step/<int:step_id>/control", methods=["GET"])
def get_controls(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    controls = Control.query.filter(Control.step_id == step.id).all()
    return jsonify({"controls": [control.to_dict() for control in controls]})

@control_routes.route("/control/<int:control_id>", methods=["GET"])
def get_control(control_id):
    control = Control.query.get(control_id)
    if not control:
        return jsonify({"message": "Control not found"}), 404
    return jsonify({"control": control.to_dict()})
    