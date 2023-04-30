from .db import db, environment, SCHEMA, add_prefix_for_prod

class Step(db.Model):
    __tablename__ = 'steps'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    jha_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jhas.id"), ondelete="CASCADE"), nullable=False)
    hazards = db.relationship("Hazard", backref="hazards_step", lazy=True, cascade="all, delete-orphan")
    controls = db.relationship("Control", backref="controls_step", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "jha_id": self.jha_id,
            "hazards": [hazard.to_dict() for hazard in self.hazards],
            "controls": [control.to_dict() for control in self.controls]
        }
