"""Schema tests: every sample fixture validates, malformed records are
rejected loudly, and JSON round-trips cleanly."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from src.schema import Service

REPO_ROOT = Path(__file__).resolve().parent.parent
PROCESSED_DIR = REPO_ROOT / "data" / "processed"


def _valid_service_dict() -> dict:
    """Minimal valid Service dict, used as a base for rejection tests."""
    return {
        "service_id": "TEST-001",
        "service_name": "Test Service",
        "agency": "TEST",
        "rich_description": "Some description.",
        "eligibility": {
            "citizenship": ["citizen"],
            "age_min": 21,
            "age_max": 65,
            "income_ceiling_monthly_sgd": 2000,
            "employment_status": ["unemployed"],
            "other_criteria": [],
        },
        "required_documents": [
            {"name": "NRIC", "required_if": None, "notes": None},
        ],
        "oth_location": "Level 1",
        "operating_hours": {"mon-fri": "09:00-17:00"},
        "contact": {"phone": "1800-000-0000", "email": None, "website": None},
        "walk_in_accepted": True,
        "appointment_required": False,
        "typical_processing_time": "2 weeks",
        "last_updated": "2026-05-20",
        "source_url": "https://example.gov.sg",
    }


def test_loads_all_three_sample_services():
    fixtures = sorted(PROCESSED_DIR.glob("*.json"))
    assert len(fixtures) >= 3, f"expected at least 3 fixtures, found {len(fixtures)}"
    for path in fixtures:
        Service.model_validate_json(path.read_text(encoding="utf-8"))


def test_json_round_trip():
    fixture = PROCESSED_DIR / "MSF-001-comcare-short-to-medium.json"
    original_json = fixture.read_text(encoding="utf-8")
    service = Service.model_validate_json(original_json)
    dumped = service.model_dump_json()
    reloaded = Service.model_validate_json(dumped)
    assert reloaded == service
    assert reloaded.last_updated.isoformat() == "2026-05-20"


def test_rejects_invalid_citizenship_literal():
    bad = _valid_service_dict()
    bad["eligibility"]["citizenship"] = ["singaporean"]
    with pytest.raises(ValidationError):
        Service.model_validate(bad)


def test_rejects_missing_required_field():
    bad = _valid_service_dict()
    del bad["service_id"]
    with pytest.raises(ValidationError):
        Service.model_validate(bad)


def test_rejects_extra_field():
    bad = _valid_service_dict()
    bad["foo"] = "bar"
    with pytest.raises(ValidationError):
        Service.model_validate(bad)


def test_rejects_age_min_greater_than_age_max():
    bad = _valid_service_dict()
    bad["eligibility"]["age_min"] = 70
    bad["eligibility"]["age_max"] = 30
    with pytest.raises(ValidationError):
        Service.model_validate(bad)


def test_rejects_malformed_date():
    bad = _valid_service_dict()
    bad["last_updated"] = "20 May 2026"
    with pytest.raises(ValidationError):
        Service.model_validate(bad)
