from flask import Blueprint, jsonify, request
from app.models import JHA, Step, Hazard
from app.models import db

# Create a Blueprint for the hazard routes
hazard_routes = Blueprint("hazard_routes", __name__)

# Route for creating a new hazard associated with a given step
@hazard_routes.route("/step/<int:step_id>/hazard", methods=["POST"])
def create_hazard(step_id):

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

    # Extract the consequence from the data
    consequence = data.get("consequence", "")
    
    # Create a new hazard with the given description, consequence, and step_id
    hazard = Hazard(description=data["description"], consequence=consequence, step_id=step.id)

    # Add the new hazard to the database
    db.session.add(hazard)
    db.session.commit()

    # Return a JSON response with a message and the new hazard
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

# Route for updating an existing hazard with a given hazard_id
@hazard_routes.route("/hazard/<int:hazard_id>", methods=["PUT"])
def update_hazard(hazard_id):

    # Get the hazard associated with the given hazard_id
    hazard = Hazard.query.get(hazard_id)

    # If the hazard doesn't exist, return a 404 error
    if not hazard:
        return jsonify({"message": "Hazard not found"}), 404

    # Get the data from the request body
    data = request.get_json()

    # If the description is missing, return a 400 error
    if not data["description"]:
        return jsonify({"message": "Description is required"}), 400
    
    # Update the hazard's description
    hazard.description = data["description"]

    # Add the updated hazard to the database
    db.session.commit()

    # Get the step associated with the hazard
    step = Step.query.get(hazard.step_id)

    # Get the jha_id from the step
    jha_id = step.jha_id

    # Return a JSON response with a message and the updated hazard
    return jsonify({"message": "Hazard updated", "hazard": {"id": hazard.id, "description": hazard.description, "step_id": hazard.step_id, "jha_id": jha_id}})

# Route for deleting an existing hazard with a given hazard_id
@hazard_routes.route("/hazard/<int:hazard_id>", methods=["DELETE"])
def delete_hazard(hazard_id):

    # Get the hazard associated with the given hazard_id
    hazard = Hazard.query.get(hazard_id)

    # If the hazard doesn't exist, return a 404 error
    if not hazard:
        return jsonify({"message": "Hazard not found"}), 404
    
    # Delete the hazard from the database
    db.session.delete(hazard)
    db.session.commit()

    # Return a JSON response with a message
    return jsonify({"message": "Hazard deleted"})

# Route for getting all hazards associated with a given step_id
@hazard_routes.route("/step/<int:step_id>/hazard", methods=["GET"])
def get_hazards(step_id):

    # Get the step associated with the given step_id
    step = Step.query.get(step_id)

    # If the step doesn't exist, return a 404 error
    if not step:
        return jsonify({"message": "Step not found"}), 404

    # Return a JSON response with a list of all hazards associated with the step
    return jsonify({"hazards": [{"id": hazard.id, "description": hazard.description, "control": hazard.control} for hazard in step.hazards]})

