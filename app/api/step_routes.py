from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard
from app.models import db

# Create a Blueprint for the step routes
step_routes = Blueprint("step_routes", __name__)

# Route for creating a new step associated with a given jha
@step_routes.route("/jha/createStep/<int:jha_id>/step", methods=["POST"])
def create_step(jha_id):

    # Get the jha associated with the given jha_id
    jha = JHA.query.get(jha_id)

    # If the jha doesn't exist, return a 404 error
    if not jha:
        return jsonify({"message": "JHA not found"}), 404

    # Get the data from the request body
    data = request.get_json()

    # Create a new step with the given description and jha_id
    step = Step(description=data["description"], jha_id=jha.id)

    # Add the new step to the database
    db.session.add(step)
    db.session.commit()

    # Return a JSON response with a message and the new step
    return jsonify({
        "message": "Step created", 
        "step": {"id": step.id, "description": step.description, "jha_id": step.jha_id},
        "jha": {"id": jha.id, "title": jha.title},
        "jhaId": jha.id
    })

# Route for getting all steps associated with a given jha
@step_routes.route("/step/getStep/<int:step_id>", methods=["GET"])
def get_step(step_id):

    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404

    # Return a JSON response with a message and the step
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

# Route for updating an existing step with a given step_id
@step_routes.route("/step/updateStep/<int:step_id>", methods=["PUT"])
def update_step(step_id):

    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404

    # Get the data from the request body
    data = request.get_json()

    # Update the step's description with the given description
    step.description = data["description"]

    # Add the updated step to the database
    db.session.commit()

    # Return a JSON response with a message and the updated step
    return jsonify({
        "message": "Step updated",
        "step": {"id": step.id, "description": step.description, "jha_id": step.jha_id},
        "jha": {"id": step.jha.id, "title": step.jha.title},
        "jhaId": step.jha.id,
    })

# Route for deleting an existing step with a given step_id
@step_routes.route("/step/deleteStep/<int:step_id>", methods=["DELETE"])
def delete_step(step_id):

    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404

    # Delete the step from the database
    db.session.delete(step)
    db.session.commit()

    # Return a JSON response with a message
    return jsonify({"message": "Step deleted"})


