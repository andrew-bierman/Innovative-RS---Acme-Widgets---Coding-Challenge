from flask import Blueprint, jsonify, request
from app.models import JHA
from app import db

jha_routes = Blueprint('jha', __name__)

@jha_routes.route("/jha", methods=["GET"])
def get_jhas():
    jhas = JHA.query.all()

    response = []
    for jha in jhas:
        jha_dict = jha.to_dict()
        jha_dict['steps'] = [step.to_dict() for step in jha.steps]
        jha_dict['trainings'] = [training.to_dict() for training in jha.trainings]
        jha_dict['ppes'] = [ppe.to_dict() for ppe in jha.ppes]
        response.append(jha_dict)

    return jsonify({"jhas": response})

@jha_routes.route("/jha/getJHA/<int:jha_id>", methods=["GET"])
def get_jha(jha_id):
    jha = JHA.query.get(jha_id)
    if jha:
        jha_dict = jha.to_dict()
        jha_dict['steps'] = [step.to_dict() for step in jha.steps]
        return jsonify({"jha": jha_dict})
    return jsonify({"message": "JHA not found"}), 404


@jha_routes.route("/jha", methods=["POST"])
def create_jha():
    data = request.get_json()
    new_jha = JHA(title=data["title"], author=data["author"], steps=[], trainings=[], ppes=[])
    db.session.add(new_jha)
    db.session.commit()

    return jsonify({
        "message": "JHA created", 
        "jha": {"id": new_jha.id, 
        "title": new_jha.title, 
        "author": new_jha.author,
        "steps": [step.to_dict() for step in new_jha.steps],
        "trainings": [training.to_dict() for training in new_jha.trainings],
        "ppes": [ppe.to_dict() for ppe in new_jha.ppes],
        }})


@jha_routes.route("/jha/updateJHA/<int:jha_id>", methods=["PUT"])
def update_jha(jha_id):
    data = request.get_json()
    jha = JHA.query.get(jha_id)
    if jha:
        jha.title = data["title"]
        jha.author = data["author"]
        db.session.commit()
        return jsonify({"message": "JHA updated", "jha": {"id": jha.id, "title": jha.title, "author": jha.author}})
    return jsonify({"message": "JHA not found"})


@jha_routes.route("/jha/deleteJHA/<int:jha_id>", methods=["DELETE"])
def delete_jha(jha_id):
    jha = JHA.query.get(jha_id)
    if jha:
        db.session.delete(jha)
        db.session.commit()
        return jsonify({"message": "JHA deleted"})
    return jsonify({"message": "JHA not found"}), 404