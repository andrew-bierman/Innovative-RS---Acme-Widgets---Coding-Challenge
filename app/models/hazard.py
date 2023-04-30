from .db import db, environment, SCHEMA, add_prefix_for_prod

class Hazard(db.Model):
    __tablename__ = 'hazards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    consequence = db.Column(db.String(300), nullable=True)
    step_id = db.Column(db.Integer, db.ForeignKey("steps.id", ondelete="CASCADE"), nullable=False)
    step = db.relationship("Step", back_populates="hazards", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "consequence": self.consequence,
            "step_id": self.step_id
        }
