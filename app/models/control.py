from .db import db, environment, SCHEMA, add_prefix_for_prod

class Control(db.Model):
    __tablename__ = 'controls'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    step_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("steps.id"), ondelete="CASCADE"), nullable=False) 
    step = db.relationship("Step", back_populates="controls", lazy=True) 


    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "step_id": self.step_id
        }