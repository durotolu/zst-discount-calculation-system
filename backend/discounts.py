from abc import ABC, abstractmethod

# Abstract base class for discount strategies
class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, price, quantity=1, **kwargs):
        pass

# Percentage discount (e.g., 10% off)
class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage):
        self.percentage = percentage

    def apply(self, price, quantity=1, **kwargs):
        total_price = price * quantity
        discount_amount = total_price * (self.percentage / 100)
        return max(total_price - discount_amount, 0)

# Flat discount (e.g., $50 off)
class FlatDiscount(DiscountStrategy):
    def __init__(self, amount):
        self.amount = amount

    def apply(self, price, quantity=1, **kwargs):
        total_price = price * quantity
        return max(total_price - self.amount, 0)

# Buy-One-Get-One-Free discount
class BOGODiscount(DiscountStrategy):
    def apply(self, price, quantity=1, **kwargs):
        if quantity >= 2:
            # For BOGO: if you buy an even number, you pay for half.
            # If odd, you pay for (quantity // 2 + 1)
            num_paid_units = (quantity + 1) // 2
            return num_paid_units * price
        else:
            return price * quantity

# Factory to return the appropriate discount instance
class DiscountFactory:
    @staticmethod
    def get_discount(discount_type, **kwargs):
        if discount_type == 'percentage':
            return PercentageDiscount(kwargs.get('value', 0))
        elif discount_type == 'flat':
            return FlatDiscount(kwargs.get('value', 0))
        elif discount_type == 'bogo':
            return BOGODiscount()
        else:
            raise ValueError("Invalid discount type")
