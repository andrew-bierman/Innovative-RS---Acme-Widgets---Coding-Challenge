from .db import db, environment, SCHEMA, add_prefix_for_prod

class PPE(db.Model):
    __tablename__ = 'ppes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    jha_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jhas.id"), ondelete='CASCADE'), nullable=False)

    jha = db.relationship("JHA", back_populates="ppes")

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            # "jha_id": self.jha_id
        }