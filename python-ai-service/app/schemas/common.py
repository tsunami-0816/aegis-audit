from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    code: int
    message: str
    data: Optional[T] = None

    @classmethod
    def success(cls, data: T = None, message: str = "success") -> "ApiResponse[T]":
        return cls(code=200, message=message, data=data)

    @classmethod
    def fail(cls, code: int = 500, message: str = "internal server error") -> "ApiResponse":
        return cls(code=code, message=message, data=None)

    @classmethod
    def unauthorized(cls, message: str = "unauthorized") -> "ApiResponse":
        return cls(code=401, message=message, data=None)

    @classmethod
    def forbidden(cls, message: str = "forbidden") -> "ApiResponse":
        return cls(code=403, message=message, data=None)

    @classmethod
    def not_found(cls, message: str = "not found") -> "ApiResponse":
        return cls(code=404, message=message, data=None)