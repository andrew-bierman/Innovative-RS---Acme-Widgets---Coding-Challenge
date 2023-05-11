from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard, Control
from app.models import db

# Create a Blueprint for the control routes
control_routes = Blueprint("control_routes", __name__)

# Route for creating a new control associated with a given step
@control_routes.route("/step/<int:step_id>/control", methods=["POST"])
def create_control(step_id):
    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404

    # Get the data from the request body
    data = request.get_json()

    # Extract the description from the data
    description = data.get("description")

    # If the description is missing, return a 400 error
    if not description:
        return jsonify({"message": "Description is required"}), 400

    # Create a new control with the given description and step_id
    control = Control(description=data["description"], step_id=step.id)

    # Add the new control to the database
    db.session.add(control)
    db.session.commit()

    # Return a JSON response with a message and the new control
    return jsonify({
        "message": "Control created",
        "control": {
            "id": control.id,
            "description": control.description,
            "step_id": control.step_id,
            "jha_id": step.jha_id
        }
    })

# Route for updating an existing control with a given control_id 
@control_routes.route("/control/<int:control_id>", methods=["PUT"])
def update_control(control_id):
    # Get the control associated with the given control_id
    control = Control.query.get(control_id)

    # If the control doesn't exist, return a 404 error
    if not control:
        return jsonify({"message": "Control not found"}), 404

    # Get the data from the request body
    data = request.get_json()

    # If the description is missing, return a 400 error
    if not data["description"]:
        return jsonify({"message": "Description is required"}), 400

    # Extract the description from the data and update the control
    control.description = data["description"]

    # Add the updated control to the database
    db.session.commit()

    # Get the step associated with the updated control
    step = Step.query.get(control.step_id)

    # Get the jha_id associated with the updated control
    jha_id = step.jha_id

    # Return a JSON response with a message and the updated control
    return jsonify({"message": "Control updated", "control": {"id": control.id, "description": control.description, "step_id": control.step_id, "jha_id": jha_id}})


# Route for deleting an existing control with a given control_id
@control_routes.route("/control/<int:control_id>", methods=["DELETE"])
def delete_control(control_id):

    # Get the control associated with the given control_id
    control = Control.query.get(control_id)

    # If the control doesn't exist, return a 404 error
    if not control:
        return jsonify({"message": "Control not found"}), 404

    # Delete the control from the database
    db.session.delete(control)
    db.session.commit()

    # Return a JSON response with a message
    return jsonify({"message": "Control deleted"})

# Route for getting all controls associated with a given step_id
@control_routes.route("/step/<int:step_id>/control", methods=["GET"])
def get_controls(step_id):

    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404
    
    # Get all controls associated with the given step_id
    controls = Control.query.filter(Control.step_id == step.id).all()

    # Return a JSON response with all controls associated with the given step_id
    return jsonify({"controls": [control.to_dict() for control in controls]})

# Route for getting a single control associated with a given control_id
@control_routes.route("/control/<int:control_id>", methods=["GET"])
def get_control(control_id):

    # Get the control associated with the given control_id
    control = Control.query.get(control_id)

    # If the control doesn't exist, return a 404 error
    if not control:
        return jsonify({"message": "Control not found"}), 404
    
    # Return a JSON response with the control associated with the given control_id
    return jsonify({"control": control.to_dict()})
    