from flask import Blueprint, jsonify, request
from app.models import JHA
from app import db

# Create a Blueprint for the jha routes
jha_routes = Blueprint('jha', __name__)

# Route for creating a new jha
@jha_routes.route("/jha", methods=["GET"])
def get_jhas():

    # Get all the jhas from the database
    jhas = JHA.query.all()

    # Create a list of dictionaries representing the jhas
    response = []

    # Add each jha to the list of dictionaries
    for jha in jhas:
        # Convert the jha to a dictionary
        jha_dict = jha.to_dict()

        # Add the steps, trainings, and ppes to the jha dictionary
        jha_dict['steps'] = [step.to_dict() for step in jha.steps]
        jha_dict['trainings'] = [training.to_dict() for training in jha.trainings]
        jha_dict['ppes'] = [ppe.to_dict() for ppe in jha.ppes]

        # Add the jha dictionary to the list of dictionaries
        response.append(jha_dict)

    # Return a JSON response with the list of jhas
    return jsonify({"jhas": response})

# Route for creating a new jha
@jha_routes.route("/jha/getJHA/<int:jha_id>", methods=["GET"])
def get_jha(jha_id):

    # Get the jha associated with the given jha_id
    jha = JHA.query.get(jha_id)

    # If the jha exists return a JSON response with the jha
    if jha:
        # Convert the jha to a dictionary
        jha_dict = jha.to_dict()

        # Add the steps to the jha dictionary
        jha_dict['steps'] = [step.to_dict() for step in jha.steps]

        # Return a JSON response with the jha
        return jsonify({"jha": jha_dict})
    return jsonify({"message": "JHA not found"}), 404

# Route for creating a new jha
@jha_routes.route("/jha", methods=["POST"])
def create_jha():

    # Get the data from the request body
    data = request.get_json()

    # Create a new jha with the given title and author
    new_jha = JHA(title=data["title"], author=data["author"], steps=[], trainings=[], ppes=[])

    # Add the new jha to the database
    db.session.add(new_jha)
    db.session.commit()

    # Return a JSON response with a message and the new jha
    return jsonify({
        "message": "JHA created", 
        "jha": {"id": new_jha.id, 
        "title": new_jha.title, 
        "author": new_jha.author,
        "steps": [step.to_dict() for step in new_jha.steps],
        "trainings": [training.to_dict() for training in new_jha.trainings],
        "ppes": [ppe.to_dict() for ppe in new_jha.ppes],
        }})

# Route for updating a jha
@jha_routes.route("/jha/updateJHA/<int:jha_id>", methods=["PUT"])
def update_jha(jha_id):

    # Get the data from the request body
    data = request.get_json()

    # Get the jha associated with the given jha_id
    jha = JHA.query.get(jha_id)

    # If the jha exists update the jha and commit the changes to the database
    if jha:
        jha.title = data["title"]
        jha.author = data["author"]
        db.session.commit()

        # Return a JSON response with a message and the updated jha
        return jsonify({"message": "JHA updated", "jha": {"id": jha.id, "title": jha.title, "author": jha.author}})
    return jsonify({"message": "JHA not found"})

# Route for deleting a jha
@jha_routes.route("/jha/deleteJHA/<int:jha_id>", methods=["DELETE"])
def delete_jha(jha_id):

    # Get the jha associated with the given jha_id
    jha = JHA.query.get(jha_id)

    # If the jha exists delete the jha and commit the changes to the database
    if jha:
        db.session.delete(jha)
        db.session.commit()
        return jsonify({"message": "JHA deleted"})
    return jsonify({"message": "JHA not found"}), 404