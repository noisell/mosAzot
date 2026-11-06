from pydantic import BaseModel, Field


class ProductBalloonSchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    price_trade: float | None = Field(description="Цена обмена", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)


class ProductBaseSchema(ProductBalloonSchema):
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")
    description: str = Field(description="Описание товара", title="", max_length=512)
    balloon: bool = Field(description="Это закись азота?", title="")


class ProductSchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")
    description: str = Field(description="Описание товара", title="", max_length=512)


class ProductForBasketSchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    price_trade: float | None = Field(description="Цена обмена", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    balloon: bool = Field(description="Это закись азота?", title="")
    active: bool = Field(description="Active of the product", title="")


class ProductForHistorySchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    image: str = Field(description="Image of the product", title="", max_length=512)
    size: str = Field(description="Size of the product", title="", max_length=32)
    balloon: bool = Field(description="Это закись азота?", title="")


class ProductCreateSchema(BaseModel):
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    price_trade: float | None = Field(description="Цена обмена", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")
    description: str = Field(description="Описание товара", title="", max_length=512)
    balloon: bool = Field(description="Это закись азота?", title="")
