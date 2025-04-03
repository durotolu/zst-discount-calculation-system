from flask import Blueprint, request, jsonify
from models import Product
from database import db
from discounts import DiscountFactory

api = Blueprint('api', __name__)

# Endpoint to create a new product
@api.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    if not name or price is None:
        return jsonify({"error": "Name and price are required"}), 400

    product = Product(name=name, price=price)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

# Endpoint to delete a new product
@api.route('/products', methods=['DELETE'])
def delete_product():
    data = request.get_json()
    id = data.get('id')
    if not id:
        return jsonify({"error": "product id required"}), 400

    product = Product.query.get(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

# Endpoint to retrieve the list of products
@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

# Endpoint to apply a discount on a product and calculate the final price
@api.route('/products/<int:product_id>/apply_discount', methods=['POST'])
def apply_discount(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    discount_type = data.get('discount_type')
    discount_value = data.get('discount_value', 0)  # For percentage or flat discounts
    quantity = data.get('quantity', 1)     # Default quantity is 1

    try:
        discount = DiscountFactory.get_discount(discount_type, value=discount_value)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    final_price = discount.apply(product.price, quantity=quantity)
    return jsonify({
        "product": product.to_dict(),
        "discount_type": discount_type,
        "original_price": product.price * quantity,
        "final_price": final_price
    }), 200
