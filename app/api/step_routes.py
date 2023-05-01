from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard
from app.models import db

step_routes = Blueprint("step_routes", __name__)

@step_routes.route("/jha/createStep/<int:jha_id>/step", methods=["POST"])
def create_step(jha_id):
    jha = JHA.query.get(jha_id)
    if not jha:
        return jsonify({"message": "JHA not found"}), 404
    data = request.get_json()
    step = Step(description=data["description"], jha_id=jha.id)
    db.session.add(step)
    db.session.commit()
    return jsonify({
        "message": "Step created", 
        "step": {"id": step.id, "description": step.description, "jha_id": step.jha_id},
        "jha": {"id": jha.id, "title": jha.title},
        "jhaId": jha.id
    })

@step_routes.route("/step/getStep/<int:step_id>", methods=["GET"])
def get_step(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    return jsonify({
        "message": "Step found",
        "step": {
            "id": step.id, 
            "description": step.description, 
            "jha_id": step.jha_id,
            "hazards": [ hazard.to_dict() for hazard in step.hazards ],
            "controls": [ control.to_dict() for control in step.controls ]
        },
        "jha": {"id": step.jha.id, "title": step.jha.title},
        "jhaId": step.jha.id,
    })

@step_routes.route("/step/updateStep/<int:step_id>", methods=["PUT"])
def update_step(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    data = request.get_json()
    step.description = data["description"]
    db.session.commit()
    return jsonify({
        "message": "Step updated",
        "step": {"id": step.id, "description": step.description, "jha_id": step.jha_id},
        "jha": {"id": step.jha.id, "title": step.jha.title},
        "jhaId": step.jha.id,
    })

@step_routes.route("/step/deleteStep/<int:step_id>", methods=["DELETE"])
def delete_step(step_id):
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"message": "Step not found"}), 404
    db.session.delete(step)
    db.session.commit()
    return jsonify({"message": "Step deleted"})


