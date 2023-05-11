from .db import db, environment, SCHEMA, add_prefix_for_prod

# Define a model for the ppes table
class PPE(db.Model):

    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'ppes'

    # Tell SQLAlchemy what the table schema is (if we aren't using the default 'public' schema)
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Create the columns for the ppes table
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)

    # Create a foreign key to the jhas table
    jha_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jhas.id"), ondelete='CASCADE'), nullable=False)

    # Create a relationship with the jhas table
    jha = db.relationship("JHA", back_populates="ppes")

    # Define how data will be displayed when it is converted to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            # "jha_id": self.jha_id
        }