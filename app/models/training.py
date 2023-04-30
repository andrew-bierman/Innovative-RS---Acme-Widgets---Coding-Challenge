from .db import db, environment, SCHEMA, add_prefix_for_prod

class Training(db.Model):
    __tablename__ = 'trainings'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    jha_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jhas.id"), ondelete='CASCADE'), nullable=False)
    jha = db.relationship("JHA", back_populates="trainings", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "jha_id": self.jha_id
        }