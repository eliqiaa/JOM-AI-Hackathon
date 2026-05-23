"""Pydantic v2 schema for the Digital OTH service catalogue.

Only `Service.rich_description` is ever embedded. Every other field is
structured metadata that downstream consumers (the chatbot LLM) read
deterministically — never re-parsed from prose.
"""

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator


_STRICT = ConfigDict(extra="forbid")


class Eligibility(BaseModel):
    model_config = _STRICT

    citizenship: list[Literal["citizen", "PR", "foreigner"]]
    age_min: int | None = None
    age_max: int | None = None
    income_ceiling_monthly_sgd: int | None = None
    employment_status: list[str] | None = None
    other_criteria: list[str] = []

    @field_validator("age_max")
    @classmethod
    def _age_max_gte_age_min(cls, v: int | None, info) -> int | None:
        age_min = info.data.get("age_min")
        if v is not None and age_min is not None and v < age_min:
            raise ValueError(f"age_max ({v}) must be >= age_min ({age_min})")
        return v


class Document(BaseModel):
    model_config = _STRICT

    name: str
    required_if: str | None = None
    notes: str | None = None


class Contact(BaseModel):
    model_config = _STRICT

    phone: str | None = None
    email: str | None = None
    website: str | None = None


class Service(BaseModel):
    model_config = _STRICT

    service_id: str
    service_name: str
    agency: str

    # "Physical_OTH": a staffed counter exists at Our Tampines Hub itself.
    # "Digital_Hotline": no OTH counter — accessed via hotline / website.
    # The chatbot uses this to decide routing: Physical_OTH services get
    # walking directions; Digital_Hotline services get the phone/web
    # details PLUS a referral to ServiceSG @ OTH for in-person digital help.
    location_type: Literal["Physical_OTH", "Digital_Hotline"]

    rich_description: str

    eligibility: Eligibility
    required_documents: list[Document]

    oth_location: str
    operating_hours: dict[str, str]
    contact: Contact
    walk_in_accepted: bool
    appointment_required: bool
    typical_processing_time: str

    last_updated: date
    source_url: str
