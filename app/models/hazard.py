from .db import db, environment, SCHEMA, add_prefix_for_prod

# Define a model for the hazards table
class Hazard(db.Model):

    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'hazards'

    # Tell SQLAlchemy what the table schema is (if we aren't using the default 'public' schema)
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Create the columns for the hazards table
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    consequence = db.Column(db.String(300), nullable=True)

    # Create a foreign key to the steps table
    step_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("steps.id"), ondelete="CASCADE"), nullable=False)

    # Create a relationship with the steps table
    step = db.relationship("Step", back_populates="hazards", lazy=True)

    # Define how data will be displayed when it is converted to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "consequence": self.consequence,
            "step_id": self.step_id
        }
