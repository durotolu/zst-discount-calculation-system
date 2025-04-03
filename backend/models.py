from database import db
from sqlalchemy import Column, Integer, String, Float

class Product(db.Model):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "price": self.price}
