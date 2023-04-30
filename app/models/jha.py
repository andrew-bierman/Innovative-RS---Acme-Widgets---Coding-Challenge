from .db import db, environment, SCHEMA, add_prefix_for_prod

class JHA(db.Model):
    __tablename__ = 'jhas'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    steps = db.relationship("Step", backref="jha", lazy=True, cascade="all, delete-orphan")
    trainings = db.relationship("Training", back_populates="jha", lazy=True, cascade="all, delete-orphan")
    ppes = db.relationship("PPE", back_populates="jha", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "steps": [step.to_dict() for step in self.steps],
            "trainings": [training.to_dict() for training in self.trainings],
            "ppes": [ppe.to_dict() for ppe in self.ppes]
        }
